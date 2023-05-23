import { getSignature } from '@/utils/sendApiRequest'
import {  SignatureSuccess } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorMessage = {
  error: string
}

const getCreateSignatureHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<SignatureSuccess | ErrorMessage>
) => {
  const { id } = req.query
    console.log("getCreateSignatureHandler ", id);
  if (!id) {
    res.status(400).json({ error: "ID missing" })
  } else {
    const response = await getSignature((req.headers.authorization || "").substring("Bearer ".length),
      id as string,
      (req.headers["x-dfns-useraction"] as string) || "")
    res.status(200).json(response)
  }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignatureSuccess | ErrorMessage>
) {
    return getCreateSignatureHandler(req, res)
    res.status(404).json({ error: "Not found" })
}
