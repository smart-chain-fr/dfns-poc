import { registerUser } from '@/utils/sendApiRequest'
import { CreateUserRegistrationInput } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorMessage = {
  error: string
}

type Success = {
  message: 'success'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Success | ErrorMessage>
) {
  if (req.method !== 'POST' || !req.body) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const input = req.body as CreateUserRegistrationInput
  const response = await registerUser(input, (req.headers.authorization || '').substring('Bearer '.length))

  res.status(200).json({message:'success'})
}
