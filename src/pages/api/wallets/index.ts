import { getBearerToken } from '@/utils/getBearerToken'
import { listPublicKeys, listWallets, postRequest } from '@/utils/sendApiRequest'
import {  CreatePublicKeyInput, PublicKey, ListPublicKeysSuccess, CreateWalletInput, ListWalletsSuccess } from '@/utils/types'
import { Wallet } from "ethers"
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorMessage = {
  error: string
}

const listAccountsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ListWalletsSuccess | ErrorMessage>
) => {
  const response = await listWallets((req.headers.authorization || '').substring('Bearer '.length))

  res.status(200).json(response)
}

const createAccountHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<Wallet | ErrorMessage >
) => {
  const input = req.body as CreateWalletInput
  const response =
    await postRequest<CreateWalletInput, Wallet>(   
      '/wallets', 
      input,
      getBearerToken(req.headers.authorization),
      (req.headers['x-dfns-useraction'] as string || '')
    )
  console.log("\n\nPublic Keys Response: ", response);
  res.status(200).json(response)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListWalletsSuccess | Wallet | ErrorMessage>
) {
  if (req.method === 'GET') {
    return listAccountsHandler(req, res)
  } else if (req.method === 'POST') {
    return createAccountHandler(req, res)
  }

  res.status(404).json({ error: 'Not found' })
}
