import { delegatedRegistration } from '@/utils/sendApiRequest'
import { CreateUserRegistrationChallengeResponse } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import dotenv from 'dotenv'

dotenv.config()

type ErrorMessage = {
  error: string
}

type RegisterUser = {
  username: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateUserRegistrationChallengeResponse | ErrorMessage>
) {
  if (req.method !== 'POST' || !req.body || !req.body.username) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const username = (req.body as RegisterUser).username
  const response = await delegatedRegistration(username)
  res.status(200).json(response)

  /*
  // test response
  res.status(200).json(
    {
      temporaryAuthenticationToken: 'token22',
      rp: {
        id: 'localhost',
        name: 'dfns',
      },
      user: {
        displayName: username,
        id: '32423423',
        name: username,
      },
      supportedCredentialKinds: {firstFactor:[CredentialKind.Fido2], secondFactor:[]},
      otpUrl: 'blahblah',
      challenge: 'mychallenge',
      authenticatorSelection: {
        residentKey: AuthenticatorRequirementOptions.required,
        requireResidentKey: true,
        userVerification: AuthenticatorRequirementOptions.required,
      },
      attestation: AuthenticatorAttestationOptions.direct,
      pubKeyCredParams: [{
        alg: -7,
        type: 'public-key'
      },
      {
        alg: -257,
        type: 'public-key'
      }],
      excludeCredentials: []
    }
  )*/
}
