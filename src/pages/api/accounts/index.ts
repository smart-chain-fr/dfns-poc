import { getBearerToken } from '@/utils/getBearerToken'
import { listAssetAccounts, postRequest } from '@/utils/sendApiRequest'
import { AssetAccount, CreateAssetAccountInput, ListAssetAccountsSuccess } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorMessage = {
  error: string
}

const listAccountsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ListAssetAccountsSuccess | ErrorMessage>
) => {
  const response = await listAssetAccounts((req.headers.authorization || '').substring('Bearer '.length))

  res.status(200).json(response)
}

const createAccountHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<AssetAccount | ErrorMessage>
) => {
  const input = req.body as CreateAssetAccountInput
  const response =
    await postRequest<CreateAssetAccountInput, AssetAccount>(
      '/assets/asset-accounts',
      input,
      getBearerToken(req.headers.authorization),
      (req.headers['x-dfns-useraction'] as string || '')
    )

  res.status(200).json(response)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListAssetAccountsSuccess | AssetAccount | ErrorMessage>
) {
  if (req.method === 'GET') {
    return listAccountsHandler(req, res)
  } else if (req.method === 'POST') {
    return createAccountHandler(req, res)
  }

  res.status(404).json({ error: 'Not found' })
}
