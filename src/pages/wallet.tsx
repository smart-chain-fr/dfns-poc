import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import logo from "../../public/logo.png";
import LoadingButton from "@mui/lab/LoadingButton";
import { signedRequest } from "@/utils/signedRequest";
import { PaymentSuccess } from "@/utils/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";

const inter = Inter({ subsets: ["latin"] });

export default function Wallet() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("-");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [hasBalance, setHasBalance] = useState(true); // 0 was showing up in the UI - this fixed it
  const [walletID, setWalletID] = useState();
  const [walletAddress, setWalletAddress] = useState("");

  // Show or hide Transfer button
  useEffect(() => {
    if (balance > 0) {
      setHasBalance(true);
      setLoading(false);
    } else setHasBalance(false);
  }, [balance]);

  // Set the access key JWT from local storage for use in API calls
  useEffect(() => {
    const balInterval = setInterval(async () => {
      const key = localStorage.getItem("access_key");
      setAccessKey(key || "");
      if (!key) {
        router.push("/login");
      }
    }, 10000);

    const wid = localStorage.getItem("walletID") || "";
    const addr = localStorage.getItem("address") || "";
    setWalletID(wid as any);
    setWalletAddress(addr as any);
    // Poll for balance.  Once server side, we would use a callback
    const interval = setInterval(async () => {
      if (!accessKey || accessKey === "-") {
        return;
      }
      // Get wallet balance
      const endpoint = `/api/accounts/${wid}/balance`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessKey}`,
        },
      };
      fetch(endpoint, options)
        .then(async (response) => {
          const maxUnitBalance = (await response.json()).maxUnitBalance;
          setBalance(maxUnitBalance);
        })
        .catch((error) => {
          toast.error("Couldn't get balance: ", error);
        });
    }, 10000);

    return () => clearInterval(interval);
  }, [accessKey, router]);

  // Get the wallet address
  useEffect(() => {
    if (!accessKey || accessKey === "-" || !walletID) {
      return;
    }
    // Get wallet address
    let endpoint = `/api/accounts/${walletID}`;
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessKey}`,
      },
    };
    fetch(endpoint, options)
      .then(async (response) => {
        const address = (await response.json()).address;
        localStorage.setItem("address", address || "");
        setWalletAddress(address);
      })
      .catch((error) => {
        toast.error("Couldn't get address: ", error);
      });
  }, [accessKey, walletID]);

  // Demonstrate a simple asset transfer with hardcoded values
  const handleTransfer = async () => {
    setLoading(true);
    toast.info("Transfering .00025 ETH...", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    signedRequest<PaymentSuccess>(
      "POST",
      `/api/accounts/${walletID}/transfers`,
      "POST",
      `/assets/asset-accounts/${walletID}/payments`,
      // Hardcoding transfer values for the demo
      JSON.stringify({
        receiver: {
          kind: "BlockchainWalletAddress",
          address: "0x81B8d1fa6a835809401213732D911C6A785a65Ed",
        },
        assetSymbol: "MATIC",
        amount: ".00025",
      })
    )
      .then((payment: PaymentSuccess) => {
        console.log(payment);
        setHasBalance(false);
        toast.success("Transfer Initiated!", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Couldn't transfer funds");
        setLoading(false);
      });
  };

  // Copy the wallet address when the icon is clicked
  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Copied!", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <>
      <Head>
        <title>Dfns Demo App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Image src={logo} alt="logo" width={410} height={200} />
        <div className="vflex">
          <p>Here&lsquo;s your wallet address:</p>
          <div className="hflex">
            <TextField
              disabled
              sx={{ width: "40ch" }}
              label={walletAddress}
              variant="outlined"
            />
            <IconButton onClick={handleCopy}>
              <ContentCopyIcon />
            </IconButton>
          </div>
          <h2> Balance: {balance} MATIC</h2>
        </div>
        {hasBalance && (
          <LoadingButton
            variant="contained"
            loading={loading}
            onClick={handleTransfer}
          >
            Transfer
          </LoadingButton>
        )}
      </main>
    </>
  );
}
