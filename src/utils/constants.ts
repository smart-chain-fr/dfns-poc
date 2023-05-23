import { getEnvVariable } from "./getEnvVariable"

export const apiKeyToken : string = getEnvVariable('DFNS_SERVICE_ACCOUNT_TOKEN')
export const apiKeyPrivateKey : string = getEnvVariable('DFNS_SERVICE_ACCOUNT_PRIVATE_KEY')
export const appId : string = getEnvVariable('DFNS_APP_ID')
export const appOrigin : string = getEnvVariable('DFNS_APP_ORIGIN')
export const etherscanApiKey : string = getEnvVariable('ETHERSCAN_API_KEY')
