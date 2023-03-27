import { arrayBufferToBase64UrlString, base64UrlStringToBuffer } from "./base64url"
import {
  CreateUserActionSignatureResponse,
  CreateUserLoginChallengeResponse,
  CreateUserLoginInput,
  CredentialKind
} from "./types"

export const signedRequest = async <T>(
  method: string,
  endpoint: string,
  dfnsMethod: string,
  dfnsEndpoint: string,
  body: string
) : Promise<T> => {
  const userToken = localStorage.getItem('access_key')

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
      'x-dfns-useraction': ''
    },
    body: JSON.stringify({
      userActionHttpMethod: dfnsMethod,
      userActionHttpPath: dfnsEndpoint,
      userActionPayload: body || '',
      userActionServerKind: 'Api',
    }),
  }
  const challengeResponse = await fetch("/api/sign/init", options)
  const challenge : CreateUserLoginChallengeResponse = await challengeResponse.json()
  const credential = (await navigator.credentials.get({
    mediation: 'required',
    publicKey: {
      challenge: Buffer.from(challenge.challenge),
      allowCredentials: challenge.allowCredentials.webauthn.map((cred) => ({
        id: base64UrlStringToBuffer(cred.id),
        type: 'public-key',
        transports: [],
      })),
      rpId: 'localhost', // TODO: We should load this from somewhere else
      userVerification: 'required',
      timeout: 60000,
    },
  })) as PublicKeyCredential

  const signedChallenge = credential.response as AuthenticatorAssertionResponse
  let credentials : CreateUserLoginInput = {
    challengeIdentifier: challenge.challengeIdentifier,
    firstFactor: {
      kind: CredentialKind.Fido2,
      credentialAssertion: {
        authenticatorData: arrayBufferToBase64UrlString(signedChallenge.authenticatorData),
        clientData: arrayBufferToBase64UrlString(signedChallenge.clientDataJSON),
        credId: credential.id,
        signature: arrayBufferToBase64UrlString(signedChallenge.signature),
        userHandle: arrayBufferToBase64UrlString(signedChallenge.userHandle || new Uint8Array(Buffer.from(''))),
      },
    },
  }

  options.body = JSON.stringify(credentials)
  const signatureResponse = await fetch('/api/sign', options)
  const signature : CreateUserActionSignatureResponse = await signatureResponse.json()

  options.headers['x-dfns-useraction'] = signature.userAction
  options.body = body
  options.method = method
  console.log("About to call signedRequestResponse with: ", endpoint, options);
  const signedRequestResponse = await fetch(endpoint, options)
  return await signedRequestResponse.json() as T
}
