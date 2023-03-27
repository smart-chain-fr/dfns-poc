import { getBearerToken } from '@/utils/getBearerToken'
import { getAddress, listPublicKeys, postRequest } from '@/utils/sendApiRequest'
import {  AddressSuccess } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorMessage = {
  error: string
}

const getAddressHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<AddressSuccess | ErrorMessage>
) => {
    console.log("getAddressHandler ", req.body.id);
  const response = await getAddress((req.headers.authorization || '').substring('Bearer '.length), req.body.id)
  res.status(200).json(response)
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressSuccess | ErrorMessage>
) {
    return getAddressHandler(req, res)
    res.status(404).json({ error: 'Not found' })
}
