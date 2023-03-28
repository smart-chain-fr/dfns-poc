import { getBearerToken } from "@/utils/getBearerToken";
import { getBalance } from "@/utils/sendApiRequest";
import { BalanceSuccess } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorMessage = {
  error: string;
};

const getBalanceHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<BalanceSuccess | ErrorMessage>
) => {
  const { id } = req.query;
  console.log("getBalanceHandler ", id);
  if (!id) {
    res.status(400).json({ error: "ID missing" });
  } else {
    const response = await getBalance(
      (req.headers.authorization || "").substring("Bearer ".length),
      id as string
    );
    res.status(200).json(response);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BalanceSuccess | ErrorMessage>
) {
  return getBalanceHandler(req, res);
  res.status(404).json({ error: "Not found" });
}
