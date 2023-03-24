import { appOrigin } from "@/utils/constants"
import { CreateUserCredentialOptions, CreateUserRegistrationChallengeResponse, CredentialKind, RegistrationFirstFactor, WebAuthnChallengeKind } from "@/utils/types"
import { useRouter } from "next/router"
import { ToastContainer, toast } from 'react-toastify'
import { arrayBufferToBase64UrlString, base64url, base64UrlStringToBuffer } from '@/utils/base64url'

export default function RegisterForm() {
  const router = useRouter()

  // Handles the submit event on form submit.
  const handleRegister = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Get data from the form.
    const data = {
      username: event.target.username.value,
    }

    // Send the data to the server in JSON format.

    // API endpoint where we send form data.
    const endpoint = '/api/register/init'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSON.stringify(data),
    }

    // Send the form data to our forms API on Vercel and get a response.
    fetch(endpoint, options).then(async (response) => {
      const challenge : CreateUserRegistrationChallengeResponse = await response.json()

      const credential = (await navigator.credentials.create(
        {
          publicKey: {
            challenge: Buffer.from(challenge.challenge),
            pubKeyCredParams: challenge.pubKeyCredParams.map((cred) => ({
              alg: cred.alg,
              type: 'public-key'
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
            attestation: 'direct',
            excludeCredentials: challenge.excludeCredentials.map((cred) => ({
              id: base64UrlStringToBuffer(cred.id),
              type: 'public-key',
              transports: [],
            })),
            timeout: 60000,
          },
        }
      )) as PublicKeyCredential
      const signedChallenge = credential.response as AuthenticatorAttestationResponse
      let credentials = {
        firstFactor: {
          kind: CredentialKind.Fido2,
          credentialId: credential.id,
          signature: {
            attestationData: signedChallenge.attestationObject,
            clientData: signedChallenge.clientDataJSON,
          },
        },
      }

      if (!credentials.firstFactor || credentials.firstFactor.kind !== CredentialKind.Fido2) {
        throw new Error('Missing first factor credential.')
      }

      let firstFactor : RegistrationFirstFactor = {
        credentialKind: CredentialKind.Fido2,
        credentialInfo: {
          attestationData: arrayBufferToBase64UrlString(credentials.firstFactor.signature.attestationData),
          clientData: arrayBufferToBase64UrlString(credentials.firstFactor.signature.clientData),
          credId: credentials.firstFactor.credentialId,
        },
      }
  
      const options2 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + challenge.temporaryAuthenticationToken,
        },
        body: JSON.stringify({
          firstFactorCredential: firstFactor,
        })
      }
      fetch('/api/register', options2).then(async (response) => {
        toast.success('User registered')
        router.push('/login')
      }).catch((e) => {
        console.log(e);
        toast.error("Unable to register the user")
      })
    }).catch((e) => {
      console.log(e);
      toast.error("Unable to register the user")
    })
  }

  return (
    <div>
      <ToastContainer />

      <form onSubmit={handleRegister}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required />

        <button type="submit">Register</button>
      </form>
    </div>
  )
}
