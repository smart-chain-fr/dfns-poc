import { apiKeyToken } from './constants'
import { makeHttpRequest } from './makeHttpRequest'
import { signRequestWithApiKey } from './signRequestWithApiKey'
import {
  CreateUserActionSignatureChallengeInput,
  CreateUserLoginChallengeResponse,
  CreateUserLoginInput,
  CreateUserLoginResponse,
  CreateUserRegistrationChallengeResponse,
  CreateUserRegistrationInput,
  ListAssetAccountsSuccess
} from './types'

export const delegatedLogin = async (userName: string) : Promise<string> => {
  const payload = {
    username: userName,
  }

  const request = {
    method: 'POST',
    path:  '/auth/login/delegated',
    payload: JSON.stringify(payload),
  }

  const userActionSignature = await signRequestWithApiKey(
    request.method,
    request.path,
    request.payload
  )
  const respone = await makeHttpRequest<CreateUserLoginResponse>(
    request.method,
    request.path,
    request.payload,
    apiKeyToken,
    userActionSignature
  )

  return respone.token
}

export const delegatedRegistration = async (userName: string) : Promise<CreateUserRegistrationChallengeResponse> => {
  const payload = {
    email: userName,
    kind: 'CustomerEmployee',
    scopes: [
      "auth",
      "AssetAccounts",
      "Balances",
      "CallbackEvents",
      "CallbackSubscriptions",
      "Payments",
      "PermissionAssignments",
      "PermissionsHistorical",
      "PermissionPredicates",
      "Permissions",
      "Policies",
      "PolicyControlExecutions",
      "PolicyControls",
      "PolicyRules",
      "PublicKeys",
      "PublicKeysAddresses",
      "Signatures",
      "Transactions",
      "Wallets",
    ],
    permissions: [
      "auth",
      "AssetAccounts",
      "Balances",
      "CallbackEvents",
      "CallbackSubscriptions",
      "Payments",
      "PermissionAssignments",
      "PermissionsHistorical",
      "PermissionPredicates",
      "Permissions",
      "Policies",
      "PolicyControlExecutions",
      "PolicyControls",
      "PolicyRules",
      "PublicKeys",
      "PublicKeysAddresses",
      "Signatures",
      "Transactions",
      "Wallets",
    ],
    publicKey: ''
  }

  const request = {
    method: 'POST',
    path:  '/auth/registration/delegated',
    payload: JSON.stringify(payload),
  }

  const userActionSignature = await signRequestWithApiKey(
    request.method,
    request.path,
    request.payload
  )
  const respone = await makeHttpRequest<CreateUserRegistrationChallengeResponse>(
    request.method,
    request.path,
    request.payload,
    apiKeyToken,
    userActionSignature
  )

  return respone
}

export const listAssetAccounts = async (authToken: string) : Promise<ListAssetAccountsSuccess> => {
  const request = {
    method: 'GET',
    path:  '/assets/asset-accounts',
    payload: '',
  }

  const response = await makeHttpRequest<ListAssetAccountsSuccess>(
    request.method,
    request.path,
    request.payload,
    authToken
  )
  return response
}

export const getUserActionChallenge = async (
  input: CreateUserActionSignatureChallengeInput,
  authToken: string
) : Promise<CreateUserLoginChallengeResponse> => {
  const request = {
    method: 'POST',
    path:  '/auth/action/init',
    payload: JSON.stringify(input),
  }

  const response = await makeHttpRequest<CreateUserLoginChallengeResponse>(
    request.method,
    request.path,
    request.payload,
    authToken
  )
  return response
}

export const getUserActionSignature = async (input: CreateUserLoginInput, authToken: string) : Promise<void> => {
  const request = {
    method: 'POST',
    path:  '/auth/action',
    payload: JSON.stringify(input),
  }

  await makeHttpRequest<{}>(
    request.method,
    request.path,
    request.payload,
    authToken
  )
}

export const registerUser = async (input: CreateUserRegistrationInput, registrationToken: string) : Promise<void> => {
  const request = {
    method: 'POST',
    path:  '/auth/registration',
    payload: JSON.stringify(input),
  }
  //console.log("Reg Token:", registrationToken);
  await makeHttpRequest<{}>(
    request.method,
    request.path,
    request.payload,
    registrationToken
  )
}

export const getRequest = async <InputType, OutputType>(
  api: string,
  input: InputType,
  authToken?: string,
  userActionSignature?: string
): Promise<OutputType> => {
  return await makeHttpRequest<OutputType>(
    'GET',
    api,
    input ? JSON.stringify(input) : '',
    authToken || '',
    userActionSignature
  )
}

export const putRequest = async <InputType, OutputType>(
  api: string,
  input: InputType,
  authToken?: string,
  userActionSignature?: string
): Promise<OutputType> => {
  return await makeHttpRequest<OutputType>(
    'PUT',
    api,
    input ? JSON.stringify(input) : '',
    authToken || '',
    userActionSignature
  )
}

export const postRequest = async <InputType, OutputType>(
  api: string,
  input: InputType,
  authToken?: string,
  userActionSignature?: string
): Promise<OutputType> => {
  return await makeHttpRequest<OutputType>(
    'POST',
    api,
    input ? JSON.stringify(input) : '',
    authToken || '',
    userActionSignature
  )
}

export const deleteRequest = async <InputType, OutputType>(
  api: string,
  input: InputType,
  authToken?: string,
  userActionSignature?: string
): Promise<OutputType> => {
  return await makeHttpRequest<OutputType>(
    'DELETE',
    api,
    input ? JSON.stringify(input) : '',
    authToken || '',
    userActionSignature
  )
}
