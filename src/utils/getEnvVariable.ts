export const getEnvVariable = (name: string) : string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment varibale (${name}) not set.`)
  }
  return value
}
