import { listAssetAccounts } from '@/utils/sendApiRequest'
import { ListAssetAccountsSuccess } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorMessage = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListAssetAccountsSuccess | ErrorMessage>
) {
  if (req.method !== 'GET') {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const response = await listAssetAccounts((req.headers.authorization || '').substring('Bearer '.length))

  res.status(200).json(response)
}
