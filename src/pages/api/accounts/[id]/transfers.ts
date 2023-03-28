import { getBearerToken } from "@/utils/getBearerToken";
import { transfer, listPublicKeys, postRequest } from "@/utils/sendApiRequest";
import { PaymentSuccess } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorMessage = {
  error: string;
};

const getTransferHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<PaymentSuccess | ErrorMessage>
) => {
  const { id } = req.query;
  console.log("getTransferHandler ", id);
  if (!id) {
    res.status(400).json({ error: "ID missing" });
  } else {
    const response = await transfer(
      (req.headers.authorization || "").substring("Bearer ".length),
      id as string
    );
    res.status(200).json(response);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PaymentSuccess | ErrorMessage>
) {
  return getTransferHandler(req, res);
  res.status(404).json({ error: "Not found" });
}
