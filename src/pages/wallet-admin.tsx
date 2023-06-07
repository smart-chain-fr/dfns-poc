import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import logo from "../../public/logo.png";
import LoadingButton from "@mui/lab/LoadingButton";
import { signedRequest } from "@/utils/signedRequest";
import { SignatureSuccess, TransactionSuccess } from "@/utils/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import { ethers } from "ethers";

const inter = Inter({ subsets: ["latin"] });

export default function WalletBeta() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("-");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [hasBalance, setHasBalance] = useState(true); // 0 was showing up in the UI - this fixed it
  const [walletId, setWalletId] = useState("");
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

    // const pid = localStorage.getItem("walletId") || "";
    const pid = "wa-50n2g-r09qs-9pto5jrsbkttjjnn";
    const addr = localStorage.getItem("address") || "";
    setWalletId(pid as any);
    setWalletAddress(addr as any);
    // Poll for balance.  Once server side, we would use a callback
    const interval = setInterval(async () => {
      if (!accessKey || accessKey === "-" || !addr) {
        return;
      }
      // // Get wallet balance
    const provider = new ethers.providers.JsonRpcProvider(
        "https://quick-aged-glade.matic-testnet.quiknode.pro/ae21f553cba2d4b2560acd824a029a5f4f721397/",
        
      );
      await provider.getBalance(addr).then((balance) => {
        const maxUnitBalance = ethers.utils.formatEther(balance);
        setBalance(parseFloat(maxUnitBalance));
      })
    }, 5000);

    return () => clearInterval(interval);
  }, [accessKey, router]);
 

  const updateBalance = useCallback( async () => {

    if(!walletAddress) {
        setBalance(0);
        return
    }
    const provider = new ethers.providers.JsonRpcProvider(
        "https://quick-aged-glade.matic-testnet.quiknode.pro/ae21f553cba2d4b2560acd824a029a5f4f721397/",
        
      );
      await provider.getBalance(walletAddress).then((balance) => {
        const maxUnitBalance = ethers.utils.formatEther(balance);
        setBalance(parseFloat(maxUnitBalance));
      })
    
  }, [walletAddress])

  useEffect(() => {
    updateBalance();
  }, [updateBalance])

  // Get the wallet address
  useEffect(() => {
    if (!accessKey || accessKey === "-" || walletId === "") {
      return;
    }
    console.log("walletId: ", walletId);
    // Get wallet address
    let endpoint = `/api/wallets/${walletId}`;
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessKey}`,
      },
    };
    fetch(endpoint, options)
      .then(async response => {
        const address = (await response.json()).address;
        localStorage.setItem("address", address || "");
        setWalletAddress(address);
      })
      .catch(error => {
        toast.error("Couldn't get address: ", error);
      });
  }, [accessKey, walletId, walletAddress]);


  const handlePostAdminSignature = async () => {
    setLoading(true);
    toast.info("Getting signature...", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    // Get wallet address
    let endpoint = `/api/admin/wallets/${walletId}/signatures`;
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessKey}`,
      },
    };
    fetch(endpoint, options)
      .then(async response => {
        console.log("response: ", response);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        toast.error("Couldn't get address: ", error);
      });
    
    }


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

  // Copy the wallet address when the icon is clicked
  const handleCopyPk = () => {
    navigator.clipboard.writeText(walletId);
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
          <p>Here&lsquo;s your public-key id:</p>
          <div className="hflex">
            <TextField disabled sx={{ width: "40ch" }} label={walletId} variant="outlined" />
            <IconButton onClick={handleCopyPk}>
              <ContentCopyIcon />
            </IconButton>
          </div>
          <p>Here&lsquo;s your wallet address:</p>
          <div className="hflex">
            <TextField disabled sx={{ width: "40ch" }} label={walletAddress} variant="outlined" />
            <IconButton onClick={handleCopy}>
              <ContentCopyIcon />
            </IconButton>
          </div>
          <h2> Balance: {balance} MATIC</h2>
        </div>

        {
          <LoadingButton variant="contained" loading={loading} onClick={handlePostAdminSignature}>
            Sign as admin
          </LoadingButton>
        }
      </main>
    </>
  );
}
