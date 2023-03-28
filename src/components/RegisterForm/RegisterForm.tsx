import { appOrigin } from "@/utils/constants";
import {
  CreateUserCredentialOptions,
  CreateUserRegistrationChallengeResponse,
  CredentialKind,
  RegistrationFirstFactor,
  WebAuthnChallengeKind,
} from "@/utils/types";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  arrayBufferToBase64UrlString,
  base64url,
  base64UrlStringToBuffer,
} from "@/utils/base64url";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState, useRef } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef(null);

  const handleRegister = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      username: (usernameRef?.current as any)?.value,
    };

    const endpoint = "/api/register/init";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(endpoint, options)
      .then(async (response) => {
        const challenge: CreateUserRegistrationChallengeResponse =
          await response.json();

        const credential = (await navigator.credentials.create({
          publicKey: {
            challenge: Buffer.from(challenge.challenge),
            pubKeyCredParams: challenge.pubKeyCredParams.map((cred) => ({
              alg: cred.alg,
              type: "public-key",
            })),
            rp: {
              name: challenge.rp.name,
              id: challenge.rp.id,
            },
            user: {
              displayName: challenge.user.displayName,
              id: Buffer.from(challenge.user.id),
              name: challenge.user.name,
            },
            attestation: "direct",
            excludeCredentials: challenge.excludeCredentials.map((cred) => ({
              id: base64UrlStringToBuffer(cred.id),
              type: "public-key",
              transports: [],
            })),
            timeout: 60000,
          },
        })) as PublicKeyCredential;
        const signedChallenge =
          credential.response as AuthenticatorAttestationResponse;
        let credentials = {
          firstFactor: {
            kind: CredentialKind.Fido2,
            credentialId: credential.id,
            signature: {
              attestationData: signedChallenge.attestationObject,
              clientData: signedChallenge.clientDataJSON,
            },
          },
        };

        if (
          !credentials.firstFactor ||
          credentials.firstFactor.kind !== CredentialKind.Fido2
        ) {
          throw new Error("Missing first factor credential.");
        }

        let firstFactor: RegistrationFirstFactor = {
          credentialKind: CredentialKind.Fido2,
          credentialInfo: {
            attestationData: arrayBufferToBase64UrlString(
              credentials.firstFactor.signature.attestationData
            ),
            clientData: arrayBufferToBase64UrlString(
              credentials.firstFactor.signature.clientData
            ),
            credId: credentials.firstFactor.credentialId,
          },
        };

        const options2 = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + challenge.temporaryAuthenticationToken,
          },
          body: JSON.stringify({
            firstFactorCredential: firstFactor,
          }),
        };
        fetch("/api/register", options2)
          .then(async (response) => {
            toast.success("User registered");
            router.push("/login");
          })
          .catch((e) => {
            console.log(e);
            toast.error("Unable to register the user");
            setLoading(false);
          });
      })
      .catch((e) => {
        console.log(e);
        toast.error("Unable to register the user");
        setLoading(false);
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
              onClick={handleRegister}
            >
              Register
            </LoadingButton>
          </div>
        </Box>
      </div>
    </div>
  );
}
