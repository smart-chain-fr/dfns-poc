import { getBearerToken } from '@/utils/getBearerToken'
import { listPublicKeys, postRequest } from '@/utils/sendApiRequest'
import {  CreatePublicKeyInput, PublicKey, ListPublicKeysSuccess } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorMessage = {
  error: string
}

const listAccountsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ListPublicKeysSuccess | ErrorMessage>
) => {
  const response = await listPublicKeys((req.headers.authorization || '').substring('Bearer '.length))

  res.status(200).json(response)
}

const createAccountHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<PublicKey | ErrorMessage >
) => {
  const input = req.body as CreatePublicKeyInput
  const response =
    await postRequest<CreatePublicKeyInput, PublicKey>(   
      'public-keys', 
      input,
      getBearerToken(req.headers.authorization),
      (req.headers['x-dfns-useraction'] as string || '')
    )
  console.log("\n\nPublic Keys Response: ", response);
  res.status(200).json(response)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListPublicKeysSuccess | PublicKey | ErrorMessage>
) {
  if (req.method === 'GET') {
    return listAccountsHandler(req, res)
  } else if (req.method === 'POST') {
    return createAccountHandler(req, res)
  }

  res.status(404).json({ error: 'Not found' })
}
