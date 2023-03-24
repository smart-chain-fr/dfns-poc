import crypto from 'crypto'

import {
  apiKeyPrivateKey,
  apiKeyToken,
  appOrigin
} from './constants'
import { makeHttpRequest } from './makeHttpRequest'
import {
  CreateUserActionSignatureResponse,
  CreateUserLoginChallengeResponse,
  CredentialKind,
} from './types'

export const signRequestWithApiKey = async (
  method: string,
  path: string,
  payload: string
) : Promise<string> => {
  const initPayload = {
    userActionPayload: payload,
    userActionHttpPath: path,
    userActionHttpMethod: method
  }

  const response = await makeHttpRequest<CreateUserLoginChallengeResponse>(
    'POST',
    '/auth/action/init',
    JSON.stringify(initPayload),
    apiKeyToken
  )

  const clientData = JSON.stringify({
    type: 'key.get',
    challenge: response.challenge,
    origin: appOrigin
  })
  const signedClientData = crypto.sign(
    undefined,
    Buffer.from(clientData),
    apiKeyPrivateKey
  )

  const signaturePayload = {
    challengeIdentifier: response.challengeIdentifier,
    firstFactor: {
      kind: CredentialKind.Key,
      credentialAssertion: {
        credId: response.allowCredentials.key[0].id,
        clientData: Buffer.from(clientData).toString('base64url'),
        signature: Buffer.from(signedClientData).toString('base64url'),
      }
    }
  }
  //console.log(JSON.stringify(signaturePayload));

  const signatureResponse = await makeHttpRequest<CreateUserActionSignatureResponse>(
    'POST',
    '/auth/action',
    JSON.stringify(signaturePayload),
    apiKeyToken
  )

  return signatureResponse.userAction
}
