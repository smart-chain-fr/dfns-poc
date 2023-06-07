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

    const provider = new ethers.providers.JsonRpcProvider(
      "https://quick-aged-glade.matic-testnet.quiknode.pro/ae21f553cba2d4b2560acd824a029a5f4f721397/",
      
    );

    const hashedTx = ethers.utils.serializeTransaction({
      to: "0x406028cbD1C011023DF515563A19841caC70eD8B",
      value: ethers.utils.parseEther("0.0001"),
      // data: "0x7b56c2b2000000000000000000000000a2543b6ebc3d03cf120f88e70e7bac0f1b2f8391000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000",
      // to: "0x4F19b4b46f4B5AC5195fA08364b95102e88256C7",
      nonce: await provider.getTransactionCount("0xe0ed39a9b289e24b4220fe6772ad4d5ad4885b4b", "latest"),
      gasLimit: ethers.utils.hexlify(100000), // standard gas limit for simple transaction
      gasPrice: ethers.utils.hexlify(10000000000), // 1 Gwei
      chainId: 80001,
    });

    console.log(hashedTx)
    console.log(ethers.utils.keccak256(hashedTx))

    signedRequest<SignatureSuccess>(
      "POST",
      `/api/wallets/${walletId}/signatures`,
      "POST",
      `/wallets/${walletId}/signatures`,
      // Hardcoding values for the demo
      /// `keccak256("test")`
      /// @notice exactly 32 bytes are required for the hash.
      // ethers.utils.keccak256("0xf889018502540be400830186a0944f19b4b46f4b5ac5195fa08364b95102e88256c780b8607b56c2b2000000000000000000000000a2543b6ebc3d03cf120f88e70e7bac0f1b2f8391000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000830138818080"),
      JSON.stringify({
        kind: "Hash",
        hash: "44abd4cd90c77e9b6ca6f102b5335eb746b39e2522b59500268f57111baccb9a",
      }),
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
      .catch(error => {
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
      `/api/wallets/transactions`,
      "POST",
      `/wallets/transactions`,
      // Hardcoding values for the demo
      JSON.stringify({
        walletId: walletId,
        network: "MATIC",
        templateKind: "EvmGenericTx",
        /// @dev `abi.encodeWithSignature("faucet(address,uint256)",0xA2543B6ebC3D03Cf120F88e70E7bac0F1b2f8391,1);`
        data: "0x7b56c2b2000000000000000000000000a2543b6ebc3d03cf120f88e70e7bac0f1b2f8391000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000",
        to: "0x4F19b4b46f4B5AC5195fA08364b95102e88256C7",
      }),
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
      .catch(error => {
        console.log(error);
        toast.error("Couldn't mint NFT, try again later.");
        setLoading(false);
      });
  };

  const handleGetSignatures = async () => {
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
    let endpoint = `/api/wallets/${walletId}/signatures`;
    let options = {
      method: "GET",
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

  const handleTransfer = async () => {
    setLoading(true);
    toast.info("Creating transfer...", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    const provider = new ethers.providers.JsonRpcProvider(
      "https://quick-aged-glade.matic-testnet.quiknode.pro/ae21f553cba2d4b2560acd824a029a5f4f721397/"
    );


    

    const serializedTx = ethers.utils.serializeTransaction({
      to: "0x406028cbD1C011023DF515563A19841caC70eD8B",
      value: ethers.utils.parseEther("0.0001"),
      // data: "0x7b56c2b2000000000000000000000000a2543b6ebc3d03cf120f88e70e7bac0f1b2f8391000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000",
      // to: "0x4F19b4b46f4B5AC5195fA08364b95102e88256C7",
      nonce: await provider.getTransactionCount("0xe0ed39a9b289e24b4220fe6772ad4d5ad4885b4b", "latest"),
      gasLimit: ethers.utils.hexlify(100000), // standard gas limit for simple transaction
      gasPrice: ethers.utils.hexlify(10000000000), // 1 Gwei
      chainId: 80001,
    }, {
      r: "0x7a375a6cf3a637026ee57b600060071ea2f04aa570577dc85d2fe51fdd4e36dd",
      s: "0x1a2d27cc3137262ae29e1748a4ad5280be7f3f581d63d2963e6ff515e2db6be4",
      v: 0 ,
    });

    


    let tx : ethers.providers.TransactionReceipt | ethers.providers.TransactionResponse = await provider.sendTransaction(serializedTx);

    tx = await tx.wait();

    

    console.log("tx", tx);

    toast.success("Transfer successfully done.", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    setLoading(false);
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
          <LoadingButton variant="contained" loading={loading} onClick={handleGetSignatures}>
            GET SIGNATURES
          </LoadingButton>
        }
        {
          <LoadingButton variant="contained" loading={loading} onClick={handleSigning}>
            SIGN MESSAGE
          </LoadingButton>
        }
        {hasBalance && (
          <LoadingButton variant="contained" loading={loading} onClick={handleTransfer}>
            TRANSFER
          </LoadingButton>
        )}
        {hasBalance && (
          <LoadingButton variant="contained" loading={loading} onClick={handleMinting}>
            MINT NFT
          </LoadingButton>
        )}
      </main>
    </>
  );
}
