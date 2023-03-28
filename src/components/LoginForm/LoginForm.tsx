import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState, useRef } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef(null);

  // Handles the submit event on form submit.
  const handleLogin = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    setLoading(true);

    const data = {
      username: (usernameRef?.current as any)?.value,
    };
    const endpoint = "/api/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    // Send the form data to our forms API on Vercel and get a response.
    fetch(endpoint, options)
      .then(async (response) => {
        const token = (await response.json()).token;
        localStorage.setItem("access_key", token);

        router.push("/");
      })
      .catch((error) => {
        toast.error("User not registered.");

        router.push("/register");
      });
  };

  return (
    <div>
      <ToastContainer />

      <div className="vflex">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "40ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div className="hflex">
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              inputRef={usernameRef}
            />
            <LoadingButton
              variant="contained"
              loading={loading}
              onClick={handleLogin}
            >
              Login
            </LoadingButton>
          </div>
        </Box>
        <div className="hflex">
          <h4>
            Click{" "}
            <Link href="/register" style={{ color: "blue" }}>
              here
            </Link>{" "}
            to register
          </h4>
        </div>
      </div>
    </div>
  );
}
