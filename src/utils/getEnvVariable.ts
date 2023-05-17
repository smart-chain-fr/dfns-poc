import dotenv from 'dotenv'

export const getEnvVariable = (name: string) : string => {
  let value = process.env[name]
  if (!value) {
    dotenv.config()
    value = process.env[name]
    if (!value) {
      throw new Error(`Environment varibale (${name}) not set.`)
    }
  }
  return value.replace(/\\n/g, '\n')
}
