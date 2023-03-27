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
  const { id } = req.query
    console.log("getAddressHandler ", id);
  if (!id) {
    res.status(400).json({ error: 'ID missing' })
  } else {
    const response = await getAddress((req.headers.authorization || '').substring('Bearer '.length), id)
    res.status(200).json(response)
  }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressSuccess | ErrorMessage>
) {
    return getAddressHandler(req, res)
    res.status(404).json({ error: 'Not found' })
}
