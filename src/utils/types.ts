export enum CredentialKind {
  Fido2 = "Fido2",
  Key = "Key",
  Password = "Password",
  Totp = "Totp",
  RecoveryKey = "RecoveryKey"
}

export enum CredentialFactor {
  first = "first",
  second = "second",
  either = "either"
}

export type SupportedCredentials = {
  kind: CredentialKind
  factor: CredentialFactor
  requiresSecondFactor: boolean
}

export type AllowCredential = {
    type: 'public-key'
    id: string
    transports?: string
}

export type AllowCredentials = {
  webauthn: AllowCredential[]
  key: AllowCredential[]
}

export type CreateUserLoginChallengeResponse = {
  supportedCredentialKinds: SupportedCredentials[]
  challenge: string
  challengeIdentifier: string
  externalAuthenticationUrl: string
  allowCredentials: AllowCredentials
}

export type CreateUserActionSignatureResponse = {
    userAction: string
}

export type CreateUserLoginResponse = {
  token: string
}

export type AuthenticationUserInformation = {
  id: string
  displayName: string
  name: string
}

export type PubKeyCredParams = {
  type: string
  alg: number
}

export enum AuthenticatorRequirementOptions {
  required = "required",
  preferred = "preferred",
  discouraged = "discouraged"
}

export type AuthenticatorSelection = {
  authenticatorAttachment?: string
  residentKey: AuthenticatorRequirementOptions
  requireResidentKey: boolean
  userVerification: AuthenticatorRequirementOptions
}

export enum FidoCredentialsTransportKind {
  usb = "usb",
  nfc = "nfc",
  ble = "ble",
  internal = "internal",
  hybrid = "hybrid"
}

export type ExcludeCredentials = {
  type: string
  id: string
  transports: FidoCredentialsTransportKind
}

export type RelyingParty = {
  id: string
  name: string
}

export type SupportedCredentialKinds = {
  firstFactor: CredentialKind[]
  secondFactor: CredentialKind[]
}

export enum AuthenticatorAttestationOptions {
  none = "none",
  indirect = "indirect",
  direct = "direct",
  enterprise = "enterprise"
}

export type CreateUserRegistrationChallengeResponse = {
  temporaryAuthenticationToken: string
  rp: RelyingParty
  user: AuthenticationUserInformation
  supportedCredentialKinds: SupportedCredentialKinds
  otpUrl: string
  challenge: string
  authenticatorSelection: AuthenticatorSelection
  attestation: AuthenticatorAttestationOptions
  pubKeyCredParams: PubKeyCredParams[]
  excludeCredentials: ExcludeCredentials[]
}

export type RegistrationConfirmationFido2 = {
  credentialKind: CredentialKind.Fido2
  credentialInfo: CredentialAssertion
}

export type RegistrationConfirmationKey = {
  credentialKind: CredentialKind.Key
  credentialInfo: CredentialAssertion
}

export type RegistrationConfirmationRecoveryKey = {
  encryptedPrivateKey?: string
  credentialInfo: CredentialAssertion
  credentialKind: CredentialKind.RecoveryKey
}

export type CredentialAssertion = {
  credId: string
  clientData: string
  attestationData: string
}

export type RegistrationConfirmationPassword = {
  credentialKind: CredentialKind.Password
  credentialInfo: PasswordCredentialInformation
}

export type PasswordCredentialInformation = {
  password: string
}

export type RegistrationConfirmationTotp = {
  credentialKind: CredentialKind.Totp
  credentialInfo: TotpCredentialInformation
}

export type TotpCredentialInformation = {
  otpCode: string
}

export type RegistrationFirstFactor = RegistrationConfirmationFido2 | RegistrationConfirmationKey | RegistrationConfirmationPassword
export type RegistrationSecondFactor = RegistrationConfirmationFido2 | RegistrationConfirmationKey | RegistrationConfirmationTotp

export type CreateUserRegistrationInput = {
  firstFactorCredential: RegistrationFirstFactor
  secondFactorCredential?: RegistrationSecondFactor
  recoveryCredential?: RegistrationConfirmationRecoveryKey
}

export type AuthenticateUserPasswordInput = {
  kind: CredentialKind.Password
  password: string
}

export type AuthenticateUserFido2Input = {
  kind: CredentialKind.Fido2
  credentialAssertion: Fido2CredentialAssertion
}

export type Fido2CredentialAssertion = {
  credId: string
  clientData: string
  authenticatorData: string
  signature: string
  userHandle: string
}

export type KeyCredentialAssertion = {
  credId: string
  clientData: string
  signature: string
}

export type AuthenticateUserKeyInput = {
  kind: CredentialKind.Key
  credentialAssertion: KeyCredentialAssertion
}

export type AuthenticateUserTotpInput = {
  kind: CredentialKind.Totp
  otpCode: string
}

export type AuthenticateUserFirstFactor = AuthenticateUserPasswordInput | AuthenticateUserFido2Input | AuthenticateUserKeyInput
export type AuthenticateUserSecondFactor = AuthenticateUserFido2Input | AuthenticateUserKeyInput | AuthenticateUserTotpInput

export type CreateUserLoginInput = {
    challengeIdentifier: string;
    firstFactor: AuthenticateUserFirstFactor;
    secondFactor?: AuthenticateUserSecondFactor;
}

export type CreateUserActionSignatureChallengeInput = {
  userActionPayload: string
  userActionHttpMethod: string
  userActionHttpPath: string
}

export type AssetAccountAuthorization = {
  kind: string
  entityId: string
  permission: string
};

export type AssetAccount = {
  tags?: string[]
  externalId?: string
  orgId: string
  id: string
  status: string
  address?: string
  publicKey?: string
  publicKeyId?: string
  assetSymbol: string
  name: string
  dateCreated: string
  dateUpdate: string
  authorizations?: AssetAccountAuthorization[]
}

export type ListAssetAccountsSuccess = {
  items: AssetAccount[]
}

export enum WebAuthnChallengeKind {
  Create = 'create',
  Get = 'get',
}

export type WebAuthnCreateCredentialChallenge = {
  kind: WebAuthnChallengeKind.Create
  creationOptions: CredentialCreationOptions
}

export type WebAuthnGetCredentialChallenge = {
  kind: WebAuthnChallengeKind.Get
  requestOptions: CredentialRequestOptions
}

export type WebAuthnChallenge = WebAuthnGetCredentialChallenge | WebAuthnCreateCredentialChallenge


export type CreateUserCredentialOptions = {
  supportedCredentialKinds: {
    firstFactor: CredentialKind[]
    secondFactor: CredentialKind[]
  }
  credentialData: {
    webAuthnClientData: WebAuthnChallenge
    keyOrPasswordClientData: KeyClientData
  }
}

export type KeyClientData = {
  type: 'key.get' | 'key.create'
  challenge: string
  origin: string
  crossOrigin?: boolean
}

export type CreateAssetAccountInput = {
  assetSymbol: string
  groupSize?: number
  groupThreshold?: number
  publicKey?: string
  externalId?: string
  tags?: string[]
  name?: string
}
