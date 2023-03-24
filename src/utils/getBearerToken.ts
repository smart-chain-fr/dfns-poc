export const getBearerToken = (header?: string) : string => {
  if (!header || typeof header !== 'string') {
    return ''
  }
  return (header || '').substring('Bearer '.length)
}
