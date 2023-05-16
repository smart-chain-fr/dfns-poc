import crypto from "crypto";
import https from "https";

import { appId } from "./constants";
import { IncomingMessage } from "http";

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
  const host = 'api.dfns.ninja'
  const options = {
    hostname: host,
    port: 443,
    path: path,
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Content-Type': 'application/json',
      Host: host,
      'User-Agent': 'DFNS Sample App',
      "X-DFNS-APPID": appId,
      "X-DFNS-NONCE": generateNonce(),
      "X-DFNS-USERACTION": userActionSignature,
      Authorization: authToken ? "Bearer " + authToken : undefined,
    },
  };

  return new Promise((resolve, reject) => {
    let result = '';

    const handleRequest = (response: IncomingMessage) => {
      const { statusCode } = response;

      response.setEncoding('utf-8');
      response.on('data', (chunk) => {
        result += chunk;
      });

      const isStatus2xx = statusCode && statusCode >= 200 && statusCode < 300;

      response.on('end', () => {
        if (!isStatus2xx) {
          console.error(`Request failed with status code: ${response.statusCode}`);
          console.error(`${path}\n${!!authToken}\n${payload}\n${appId}`);
          console.error(`${JSON.stringify(response.headers)}`);
          let errorMessage = response.statusMessage;
          if (!errorMessage && result) {
            try {
              errorMessage = JSON.parse(result).error.message;
            } catch {
              errorMessage = 'Unknown error';
            }
          }
          reject({
            statusCode: response.statusCode,
            message: errorMessage,
          });
        } else {
          try {
            console.log("src/utils/makeHttpRequest.ts: ", result);
            if (result === '') {
              resolve({} as TResponse);
            } else {
              resolve(JSON.parse(result) as TResponse);
            }
          } catch (error) {
            reject(error);
          }
        }
      });
    };

    const request = https.request(options, handleRequest);

    request.on('error', (e) => {
      reject(e);
    });

    if (payload !== '') {
      request.write(payload);
    }

    request.end();
  });
};
