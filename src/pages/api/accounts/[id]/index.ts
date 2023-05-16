import { getAssetAccount } from "@/utils/sendApiRequest";
import { AssetAccount } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorMessage = {
  error: string;
};

const getAssetAccountHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<AssetAccount | ErrorMessage>
) => {
  const { id } = req.query;
  console.log("getAssetAccountHandler ", id);
  if (!id) {
    res.status(400).json({ error: "ID missing" });
  } else {
    const response = await getAssetAccount(
      (req.headers.authorization || "").substring("Bearer ".length),
      id as string
    );
    res.status(200).json(response);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AssetAccount | ErrorMessage>
) {
  return getAssetAccountHandler(req, res);
  res.status(404).json({ error: "Not found" });
}
