import { broadcastTransaction } from "@/utils/sendApiRequest";
import { TransactionSuccess } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorMessage = {
  error: string;
};

const broadcastTransactionHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TransactionSuccess | ErrorMessage>,
) => {
  console.log("broadcastTransactionHandler ", req.body);
  const id = req.body.publicKeyId;
  console.log("broadcastTransactionHandler ", id);
  if (!id) {
    res.status(400).json({ error: "ID missing" });
  } else {
    const response = await broadcastTransaction(
      (req.headers.authorization || "").substring("Bearer ".length),
      id as string,
      (req.headers["x-dfns-useraction"] as string) || "",
    );
    res.status(200).json(response);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<TransactionSuccess | ErrorMessage>) {
  if (req.method !== 'POST' || !req.body) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  return broadcastTransactionHandler(req, res);
}
