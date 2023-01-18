export function pruneUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}
