import { writeFileSync, mkdirSync } from 'fs'

const GITHUB_API_URL = 'https://api.github.com/repos/Uncle-Awrt/Torio-Client/releases'
const REPO_RELEASES_URL = 'https://github.com/Uncle-Awrt/Torio-Client/releases/latest'

async function main() {
  const res = await fetch(GITHUB_API_URL, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
  })

  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected response shape from GitHub API: ${JSON.stringify(data)}`)
  }

  const total = data.reduce(
    (sum, release) =>
      sum + release.assets.reduce((s, a) => s + a.download_count, 0),
    0
  )

  const publishedReleases = data.filter((r) => !r.draft)
  const latestRelease = publishedReleases[0]

  const exeAsset = latestRelease?.assets?.find((a) => a.name.toLowerCase().endsWith('.exe'))
  const zipAsset = latestRelease?.assets?.find((a) => a.name.toLowerCase().endsWith('.zip'))

  const latestUrl = exeAsset?.browser_download_url ?? zipAsset?.browser_download_url ?? REPO_RELEASES_URL

  const payload = {
    downloads: total,
    latestUrl,
    exeUrl: exeAsset?.browser_download_url ?? null,
    zipUrl: zipAsset?.browser_download_url ?? null,
    fetchedAt: new Date().toISOString(),
  }

  mkdirSync('data', { recursive: true })
  writeFileSync('data/downloads.json', JSON.stringify(payload, null, 2) + '\n')

  console.log('Wrote data/downloads.json:', payload)
}

main().catch((err) => {
  console.error('Failed to update downloads.json:', err)
  process.exit(1)
})