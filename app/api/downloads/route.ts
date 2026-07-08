let cache = { count: 0, url: '', fetchedAt: 0 }
const CACHE_TTL = 1000 * 60 * 10 // 10分

export async function GET() {
  const now = Date.now()

  if (cache.count && now - cache.fetchedAt < CACHE_TTL) {
    return Response.json({ downloads: cache.count, latestUrl: cache.url })
  }

  const res = await fetch('https://api.github.com/repos/Uncle-Awrt/Torio-Client/releases', {
    headers: { 'Accept': 'application/vnd.github+json' }
  })
  const data = await res.json()

  const total = data.reduce((sum: number, release: any) =>
    sum + release.assets.reduce((s: number, a: any) => s + a.download_count, 0), 0)

  const latestExe = data[0]?.assets?.find((a: any) => a.name.endsWith('.exe'))
  const latestUrl = latestExe?.browser_download_url ?? 'https://github.com/Uncle-Awrt/Torio-Client/releases/latest'

  cache = { count: total, url: latestUrl, fetchedAt: now }

  return Response.json({ downloads: total, latestUrl })
}