import { createWalletSignature, getSignature, getWalletSignature, listWalletSignature } from "@/utils/sendApiRequest";
import { ListWalletSignatureSuccess, SignatureSuccess, WalletSignatureSuccess } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorMessage = {
  error: string;
};

const getCreateSignatureHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<WalletSignatureSuccess | ErrorMessage>,
) => {
  const { id } = req.query;
  console.log("getCreateSignatureHandler ", id);
  if (!id) {
    res.status(400).json({ error: "ID missing" });
  } else {
    const response = await createWalletSignature(
      (req.headers.authorization || "").substring("Bearer ".length),
      id as string,
      (req.headers["x-dfns-useraction"] as string) || "",
    );
    res.status(200).json(response);
  }
};

const listSignature = async (req: NextApiRequest, res: NextApiResponse<ListWalletSignatureSuccess | ErrorMessage>) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: "ID missing" });
    return;
  }
  const response = await listWalletSignature((req.headers.authorization || "").substring("Bearer ".length), id as string);

  res.status(200).json(response);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListWalletSignatureSuccess | WalletSignatureSuccess | ErrorMessage>,
) {
  if (req.method === "GET") {
    return listSignature(req, res);
  } else if (req.method === "POST") {
    return getCreateSignatureHandler(req, res);
  }

  res.status(404).json({ error: "Not found" });
}
