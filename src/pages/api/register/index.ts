import { assignPermissionsToUser } from '@/utils/assignPermissionsToUser'
import { apiKeyToken } from '@/utils/constants'
import { makeHttpRequest } from '@/utils/makeHttpRequest'
import { registerUser } from '@/utils/sendApiRequest'
import { signRequestWithApiKey } from '@/utils/signRequestWithApiKey'
import { CreateUserRegistrationInput } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorMessage = {
  error: string
}

type Success = {
  message: 'success'
}

const archiveUser = async (userId: string) : Promise<void> => {
  console.log(`Archiving user since registration failed`)
  const request = {
    method: 'DELETE',
    path: `/auth/users/${userId}`,
    payload: '',
  };

  const userActionSignature = await signRequestWithApiKey(
    request.method,
    request.path,
    request.payload
  );
  await makeHttpRequest<void>(
    request.method,
    request.path,
    request.payload,
    apiKeyToken,
    userActionSignature
  );
  console.log(`User archived`)
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

  try {
    await assignPermissionsToUser(response.user.id)
  } catch (e) {
    try {
      await archiveUser(response.user.id)
    } catch {
      console.log(`Failed to archive user: ${response.user.id}`)
    }
    throw e
  }

  res.status(200).json({message:'success'})
}
