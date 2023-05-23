import { apiKeyToken } from "./constants";
import { makeHttpRequest } from "./makeHttpRequest";
import { signRequestWithApiKey } from "./signRequestWithApiKey";
import {
  AddressSuccess,
  AssetAccount,
  BalanceSuccess,
  CreateUserActionSignatureChallengeInput,
  CreateUserLoginChallengeResponse,
  CreateUserLoginInput,
  CreateUserLoginResponse,
  CreateUserRegistrationChallengeResponse,
  CreateUserRegistrationInput,
  ListAssetAccountsSuccess,
  ListPublicKeysSuccess,
  PaymentSuccess,
  SignatureSuccess,
  TransactionSuccess,
} from "./types";

export const delegatedLogin = async (userName: string): Promise<string> => {
  const payload = {
    username: userName,
  };

  const request = {
    method: "POST",
    path: "/auth/login/delegated",
    payload: JSON.stringify(payload),
  };

  const userActionSignature = await signRequestWithApiKey(
    request.method,
    request.path,
    request.payload
  );
  const respone = await makeHttpRequest<CreateUserLoginResponse>(
    request.method,
    request.path,
    request.payload,
    apiKeyToken,
    userActionSignature
  );

  return respone.token;
};

export const delegatedRegistration = async (
  userName: string
): Promise<CreateUserRegistrationChallengeResponse> => {
  const payload = {
    email: userName,
    kind: "CustomerEmployee",
    publicKey: "",
  };

  const request = {
    method: "POST",
    path: "/auth/registration/delegated",
    payload: JSON.stringify(payload),
  };

  const userActionSignature = await signRequestWithApiKey(
    request.method,
    request.path,
    request.payload
  );
  const respone =
    await makeHttpRequest<CreateUserRegistrationChallengeResponse>(
      request.method,
      request.path,
      request.payload,
      apiKeyToken,
      userActionSignature
    );

  return respone;
};

export const listAssetAccounts = async (
  authToken: string
): Promise<ListAssetAccountsSuccess> => {
  const request = {
    method: "GET",
    path: "/assets/asset-accounts",
    payload: "",
  };

  const response = await makeHttpRequest<ListAssetAccountsSuccess>(
    request.method,
    request.path,
    request.payload,
    authToken
  );
  return response;
};

export const listPublicKeys = async (
  authToken: string
): Promise<ListPublicKeysSuccess> => {
  const request = {
    method: "GET",
    path: "/public-keys",
    payload: "",
  };
  const response = await makeHttpRequest<ListPublicKeysSuccess>(
    request.method,
    request.path,
    request.payload,
    authToken
  );
  return response;
};

export const getAddress = async (
  authToken: string,
  id: string
): Promise<AddressSuccess> => {
  const request = {
    method: "GET",
    path: `/public-keys/${id}/address?network=MATIC`,
    payload: "",
  };
  console.log("request", request);
  const response = await makeHttpRequest<AddressSuccess>(
    request.method,
    request.path,
    request.payload,
    authToken
  );
  return response;
};

export const getAssetAccount = async (
  authToken: string,
  id: string
): Promise<AssetAccount> => {
  const request = {
    method: "GET",
    path: `/assets/asset-accounts/${id}`,
    payload: "",
  };
  const response = await makeHttpRequest<AssetAccount>(
    request.method,
    request.path,
    request.payload,
    authToken
  );
  return response;
};

export const getBalance = async (
  authToken: string,
  id: string
): Promise<BalanceSuccess> => {
  const request = {
    method: "GET",
    path: `/assets/asset-accounts/${id}/balance`,
    payload: "",
  };
  const response = await makeHttpRequest<BalanceSuccess>(
    request.method,
    request.path,
    request.payload,
    authToken
  );
  return response;
};

export const transfer = async (
  authToken: string,
  id: string,
  userAction: string
): Promise<PaymentSuccess> => {
  const request = {
    method: "POST",
    path: `/assets/asset-accounts/${id}/payments`,
    /// @dev Hardcoding transfer values for the demo.
    payload: JSON.stringify({
      receiver: {
        kind: "BlockchainWalletAddress",
        address: "0x89baD010e72c3ebE24E1E0bdA55aef93d587b1f1",
      },
      assetSymbol: "MATIC",
      amount: "0.000025",
      note: "Dfns Demo App Transfer"
    }),
  };
  const response = await makeHttpRequest<PaymentSuccess>(
    request.method,
    request.path,
    request.payload,
    authToken,
    userAction
  );
  return response;
};

export const getSignature = async (
  authToken: string,
  id: string,
  userAction: string
): Promise<SignatureSuccess> => {
  const request = {
    method: "POST",
    path: `/public-keys/${id}/signatures`,
    /// @dev Hardcoding signature values for the demo.
    payload: JSON.stringify({
      hash: "0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658"
    }),
  };
  const response = await makeHttpRequest<SignatureSuccess>(
    request.method,
    request.path,
    request.payload,
    authToken,
    userAction
  );
  return response;
};

export const broadcastTransaction = async (
  authToken: string,
  id: string,
  userAction: string
): Promise<TransactionSuccess> => {
  const request = {
    method: "POST",
    path: `/public-keys/transactions`,
    /// @dev Hardcoding signature values for the demo.
    payload: JSON.stringify({
      publicKeyId: id,
      network: "MATIC",
      templateKind: "EvmGenericTx",
      /// @dev `abi.encodeWithSignature("faucet(address,uint256)",0xA2543B6ebC3D03Cf120F88e70E7bac0F1b2f8391,1);`
      data: "0x7b56c2b2000000000000000000000000a2543b6ebc3d03cf120f88e70e7bac0f1b2f8391000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000",
      to: "0x4F19b4b46f4B5AC5195fA08364b95102e88256C7"
    }),
  };
  const response = await makeHttpRequest<TransactionSuccess>(
    request.method,
    request.path,
    request.payload,
    authToken,
    userAction
  );
  return response;
};

export const getUserActionChallenge = async (
  input: CreateUserActionSignatureChallengeInput,
  authToken: string
): Promise<CreateUserLoginChallengeResponse> => {
  const request = {
    method: "POST",
    path: "/auth/action/init",
    payload: JSON.stringify(input),
  };

  const response = await makeHttpRequest<CreateUserLoginChallengeResponse>(
    request.method,
    request.path,
    request.payload,
    authToken
  );
  return response;
};

export const getUserActionSignature = async (
  input: CreateUserLoginInput,
  authToken: string
): Promise<void> => {
  const request = {
    method: "POST",
    path: "/auth/action",
    payload: JSON.stringify(input),
  };

  await makeHttpRequest<{}>(
    request.method,
    request.path,
    request.payload,
    authToken
  );
};


export type UserCredentialInformation = {
  uuid: string;
  kind: string;
  name: string;
};
export type UserRegistrationInformation = {
    id: string;
    username: string;
    orgId: string;
};
export type UserRegistration = {
  credential: UserCredentialInformation;
  user: UserRegistrationInformation;
};

export const registerUser = async (
  input: CreateUserRegistrationInput,
  registrationToken: string
): Promise<UserRegistration> => {
  const request = {
    method: "POST",
    path: "/auth/registration",
    payload: JSON.stringify(input),
  };
  //console.log("Reg Token:", registrationToken);
  return await makeHttpRequest<UserRegistration>(
    request.method,
    request.path,
    request.payload,
    registrationToken
  );
};

export const getRequest = async <InputType, OutputType>(
  api: string,
  input: InputType,
  authToken?: string,
  userActionSignature?: string
): Promise<OutputType> => {
  return await makeHttpRequest<OutputType>(
    "GET",
    api,
    input ? JSON.stringify(input) : "",
    authToken || "",
    userActionSignature
  );
};

export const putRequest = async <InputType, OutputType>(
  api: string,
  input: InputType,
  authToken?: string,
  userActionSignature?: string
): Promise<OutputType> => {
  return await makeHttpRequest<OutputType>(
    "PUT",
    api,
    input ? JSON.stringify(input) : "",
    authToken || "",
    userActionSignature
  );
};

export const postRequest = async <InputType, OutputType>(
  api: string,
  input: InputType,
  authToken?: string,
  userActionSignature?: string
): Promise<OutputType> => {
  return await makeHttpRequest<OutputType>(
    "POST",
    api,
    input ? JSON.stringify(input) : "",
    authToken || "",
    userActionSignature
  );
};

export const deleteRequest = async <InputType, OutputType>(
  api: string,
  input: InputType,
  authToken?: string,
  userActionSignature?: string
): Promise<OutputType> => {
  return await makeHttpRequest<OutputType>(
    "DELETE",
    api,
    input ? JSON.stringify(input) : "",
    authToken || "",
    userActionSignature
  );
};
