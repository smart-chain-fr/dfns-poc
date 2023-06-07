import { assignPermissionsToUser } from "@/utils/assignPermissionsToUser";
import { createWalletSignature, createWalletSignatureAdmin, getSignature, getWalletSignature, listWalletSignature } from "@/utils/sendApiRequest";
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
      const response = await createWalletSignatureAdmin(
        id as string
      );
      res.status(200).json(response);
    }
  };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ListWalletSignatureSuccess | WalletSignatureSuccess | ErrorMessage>,
  ) {
    return getCreateSignatureHandler(req, res);
  }

  
  