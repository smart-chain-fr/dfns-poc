// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { delegatedLogin } from '@/utils/sendApiRequest'
import type { NextApiRequest, NextApiResponse } from 'next'

type LoginResponse = {
  token: string
}

type ErrorMessage = {
  error: string
}

type UserLogin = {
  username: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse | ErrorMessage>
) {
  if (req.method !== 'POST' || !req.body || !req.body.username) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const username = (req.body as UserLogin).username
  const response = await delegatedLogin(username)

  res.status(200).json({ token: response })
}
