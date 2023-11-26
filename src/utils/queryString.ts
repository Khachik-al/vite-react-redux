export const stringify = (params: Record<string, string>) => {
  const urlSearchParams = new URLSearchParams(params)
  return urlSearchParams.toString()
}

export const parse = (params: string) => {
  const urlSearchParams = new URLSearchParams(params)
  return Object.fromEntries(urlSearchParams.entries())
}
