import crypto from "crypto";
import https from "https";

import { appId } from "./constants";

const generateNonce = (): string => {
  const uuid = crypto.randomUUID();
  return Buffer.from(
    JSON.stringify({
      uuid: uuid,
      date: new Date().toISOString(),
    })
  ).toString("base64url");
};

export const makeHttpRequest = async <TResponse>(
  method: string,
  path: string,
  payload: string,
  authToken: string,
  userActionSignature = ""
): Promise<TResponse> => {
  return new Promise((resolve, reject) => {
    let response = "";
    const req = https.request(
      {
        hostname: "api.dfns.ninja",
        port: 443,
        path: path,
        method: method,
        headers: {
          Accept: "application/json",
          "X-DFNS-APPID": appId,
          "X-DFNS-NONCE": generateNonce(),
          "X-DFNS-USERACTION": userActionSignature,
          Authorization: authToken ? "Bearer " + authToken : undefined,
        },
      },
      (res) => {
        res.setEncoding("utf-8");

        res.on("data", (chunk) => {
          response += chunk;
        });

        if (!res.statusCode || res.statusCode !== 200) {
          console.log(`${path}\n${authToken}\n${payload}\n${appId}`);
          reject({
            statusCode: res.statusCode,
            message: res.statusMessage,
          });
        }

        res.on("end", async () => {
          console.log("src/utils/makeHttpRequest.ts:52 ", response);
          resolve(JSON.parse(response) as TResponse);
        });
      }
    );

    req.on("error", (e) => {
      reject(e);
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};
