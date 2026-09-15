/**
 * Pulls the 11-character video id out of any YouTube URL people paste:
 * watch?v=, youtu.be/, /embed/, /shorts/, /live/. Returns null otherwise.
 */
export function youtubeId(url) {
  const value = (url ?? '').trim()
  if (!value) return null

  const direct = value.match(/^[A-Za-z0-9_-]{11}$/)
  if (direct) return direct[0]

  try {
    const u = new URL(value)
    const host = u.hostname.replace(/^www\.|^m\./, '')
    if (host === 'youtu.be') return u.pathname.slice(1, 12) || null
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const v = u.searchParams.get('v')
      if (v) return v.slice(0, 11)
      const m = u.pathname.match(/\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/)
      if (m) return m[1]
    }
  } catch {
    return null
  }
  return null
}

export function youtubeEmbedUrl(url) {
  const id = youtubeId(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

export function youtubeThumb(url) {
  const id = youtubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}
