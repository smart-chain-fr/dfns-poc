import { getWallet } from "@/utils/sendApiRequest";
import { Wallet } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorMessage = {
  error: string;
};

const getWalletHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<Wallet | ErrorMessage>
) => {
  const { id } = req.query;
  console.log("getWalletHandler ", id);
  if (!id) {
    res.status(400).json({ error: "ID missing" });
  } else {
    const response = await getWallet(
      (req.headers.authorization || "").substring("Bearer ".length),
      id as string
    );
    res.status(200).json(response);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Wallet | ErrorMessage>
) {
  return getWalletHandler(req, res);
  res.status(404).json({ error: "Not found" });
}
