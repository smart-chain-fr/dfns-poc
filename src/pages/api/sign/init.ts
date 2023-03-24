import { getBearerToken } from '@/utils/getBearerToken'
import { postRequest } from '@/utils/sendApiRequest'
import { CreateUserActionSignatureChallengeInput, CreateUserLoginChallengeResponse } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorMessage = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateUserLoginChallengeResponse | ErrorMessage>
) {
  if (req.method !== 'POST' || !req.body) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const input = req.body as CreateUserActionSignatureChallengeInput
  const response =
    await postRequest<CreateUserActionSignatureChallengeInput, CreateUserLoginChallengeResponse>(
      '/auth/action/init',
      input,
      getBearerToken(req.headers.authorization),
      (req.headers['x-dfns-useraction'] as string || '')
    )

  res.status(200).json(response)
}
