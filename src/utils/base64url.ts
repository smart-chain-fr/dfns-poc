export const base64url = (buf: string | Buffer) : string => {
    if (typeof buf === 'string') {
      buf = Buffer.from(buf)
    }
  
    if (Buffer.isEncoding('base64url')) {
      return buf.toString('base64url')
    }
  
    return buf.toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }
  
  const padString = (str: string) : string => {
    const padLength = 4 - (str.length % 4)
    if (padLength < 4) {
      str += '='.repeat(padLength)
    }
    return str
  }
  
  export const base64FromUrl = (base64Url: string) : string => {
    if (Buffer.isEncoding('base64url')) {
      return Buffer.from(base64Url, 'base64url').toString('base64')
    }
  
    return padString(base64Url)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')
  }
  
  export const arrayBufferToBase64UrlString = (buf: ArrayBuffer | null) : string => {
    if (!buf) {
      return ''
    }
    return base64url(Buffer.from( new Uint8Array(buf) ))
  }
  
  export const base64UrlStringToBuffer = (base64Url: string) : Buffer => {
    return Buffer.from(base64FromUrl(base64Url), 'base64')
  }