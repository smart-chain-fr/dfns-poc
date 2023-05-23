import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
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

export default function Wallet() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("-");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [hasBalance, setHasBalance] = useState(true); // 0 was showing up in the UI - this fixed it
  const [publicKeyID, setPublicKeyID] = useState("");
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

    const pid = localStorage.getItem("publicKeyID") || "";
    const addr = localStorage.getItem("address") || "";
    setPublicKeyID(pid as any);
    setWalletAddress(addr as any);
    // Poll for balance.  Once server side, we would use a callback
    const interval = setInterval(async () => {
      if (!accessKey || accessKey === "-" || !addr) {
        return;
      }
      // // Get wallet balance
      const endpoint = `/api/address/${addr}/balance`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      };
      fetch(endpoint, options)
        .then(async (response) => {
          const maxUnitBalance = ethers.utils.formatEther((await response.json()));
          setBalance(parseFloat(maxUnitBalance));
        })
        .catch((error) => {
          toast.error("Couldn't get balance: ", error);
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [accessKey, router]);

  // Get the wallet address
  useEffect(() => {
    if (!accessKey || accessKey === "-" || publicKeyID === "") {
      return;
    }
    console.log("publicKeyID: ", publicKeyID)
    // Get wallet address
    let endpoint = `/api/public-keys/${publicKeyID}/address`;
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
  }, [accessKey, publicKeyID, walletAddress]);

  const handleSigning = async () => {
    setLoading(true);
    toast.info("Signing a message...", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    signedRequest<SignatureSuccess>(
      "POST",
      `/api/public-keys/${publicKeyID}/signature`,
      "POST",
      `/public-keys/${publicKeyID}/signatures`,
      // Hardcoding values for the demo
      /// `keccak256("test")`
      /// @notice exactly 32 bytes are required for the hash.
      JSON.stringify({
        hash: "0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658"
      })
    )
      .then((signature: SignatureSuccess) => {
        console.log(signature);
        setLoading(false);
        toast.success("Message successfully signed.", {
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
        toast.error("Couldn't sign, try again later.");
        setLoading(false);
      });
  };

  const handleMinting = async () => {
    setLoading(true);
    toast.info("Minting an NFT...", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    signedRequest<TransactionSuccess>(
      "POST",
      `/api/public-keys/transactions`,
      "POST",
      `/public-keys/transactions`,
      // Hardcoding values for the demo
      JSON.stringify({
        publicKeyId: publicKeyID,
        network: "MATIC",
        templateKind: "EvmGenericTx",
        /// @dev `abi.encodeWithSignature("faucet(address,uint256)",0xA2543B6ebC3D03Cf120F88e70E7bac0F1b2f8391,1);`
        data: "0x7b56c2b2000000000000000000000000a2543b6ebc3d03cf120f88e70e7bac0f1b2f8391000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000",
        to: "0x4F19b4b46f4B5AC5195fA08364b95102e88256C7"
      })
    )
      .then((transaction: TransactionSuccess) => {
        console.log(transaction);
        setLoading(false);
        toast.success("NFT successfully minted.", {
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
        toast.error("Couldn't mint NFT, try again later.");
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

  // Copy the wallet address when the icon is clicked
  const handleCopyPk = () => {
    navigator.clipboard.writeText(publicKeyID);
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
            <TextField
              disabled
              sx={{ width: "40ch" }}
              label={publicKeyID}
              variant="outlined"
            />
            <IconButton onClick={handleCopyPk}>
              <ContentCopyIcon />
            </IconButton>
          </div>
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
        {(
          <LoadingButton
            variant="contained"
            loading={loading}
            onClick={handleSigning}
          >
            SIGN MESSAGE
          </LoadingButton>
        )}
        {hasBalance && (
          <LoadingButton
            variant="contained"
            loading={loading}
            onClick={handleMinting}
          >
            MINT NFT
          </LoadingButton>
        )}
      </main>
    </>
  );
}
