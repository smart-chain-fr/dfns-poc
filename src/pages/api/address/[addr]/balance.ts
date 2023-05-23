import { getAddress } from '@/utils/sendApiRequest'
import {  AddressSuccess } from '@/utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { etherscanApiKey } from "../../../../utils/constants";

type ErrorMessage = {
  error: string
}

const getBalanceHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any | ErrorMessage>
) => {
  const { addr } = req.query
    console.log("getBalanceHandler ", addr);
  if (!addr) {
    res.status(400).json({ error: 'Address missing' })
  } else {
   const response = await fetch(`https://api-testnet.polygonscan.com/api?module=account&action=balance&address=${addr}&apikey=${etherscanApiKey}`)
   res.status(200).json((await response.json()).result)
  }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressSuccess | ErrorMessage>
) {
    return getBalanceHandler(req, res)
    res.status(404).json({ error: 'Not found' })
}
