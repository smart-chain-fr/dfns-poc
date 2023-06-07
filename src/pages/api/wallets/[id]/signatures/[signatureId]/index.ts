import { getWallet, getWalletSignature } from "@/utils/sendApiRequest";
import { Wallet, WalletSignatureSuccess } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorMessage = {
  error: string;
};

const getWalletHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<WalletSignatureSuccess | ErrorMessage>
) => {
  const { id, signatureId } = req.query;
  console.log("getWalletHandler ", id);
  if (!id) {
    res.status(400).json({ error: "ID missing" });
  } else {
    const response = await getWalletSignature(
      (req.headers.authorization || "").substring("Bearer ".length),
      id as string,
      signatureId as string
    );
    res.status(200).json(response);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WalletSignatureSuccess | ErrorMessage>
) {
  return getWalletHandler(req, res);
  res.status(404).json({ error: "Not found" });
}
