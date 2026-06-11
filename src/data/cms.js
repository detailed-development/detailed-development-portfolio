import { clientWork as fallbackClient, products as fallbackProducts } from './work'

// Where the WordPress headless CMS lives, e.g. https://cms.detaileddevelopment.com
// Set VITE_CMS_URL in .env (see .env.example). When unset, the site uses the
// bundled fallback data below so it always renders something.
const CMS_URL = (import.meta.env.VITE_CMS_URL || '').replace(/\/+$/, '')
const ENDPOINT = CMS_URL ? `${CMS_URL}/wp-json/dd/v1/projects` : ''

// How long to trust an in-memory result before refetching (ms).
const TTL = 60_000

function normalizeImage(image) {
  if (!image) return null
  if (typeof image === 'string') return image.trim() ? { url: image, alt: '' } : null
  if (image.url) return { url: image.url, alt: image.alt || '' }
  return null
}

// Coerce either a WP payload item or a static work.js item into one shape.
function normalizeProject(p) {
  return {
    slug: p.slug,
    name: p.name,
    industry: p.industry || '',
    stack: Array.isArray(p.stack) ? p.stack : [],
    summary: p.summary || '',
    bullets: Array.isArray(p.bullets) ? p.bullets : [],
    description: p.description || '',
    // Clients call it "url", products call it "link" — accept both, expose "url".
    url: p.url ?? p.link ?? null,
    image: normalizeImage(p.image),
  }
}

function normalizeSet(client, products) {
  return {
    clientWork: (client || []).map(normalizeProject),
    products: (products || []).map(normalizeProject),
  }
}

// The bundled fallback, normalized to the live shape.
export const fallbackData = normalizeSet(fallbackClient, fallbackProducts)

let cache = null // { data, source, at }
let inflight = null

async function fetchFromCms() {
  const res = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`CMS responded ${res.status}`)
  const json = await res.json()
  return normalizeSet(json.client, json.products)
}

/**
 * Resolve the project data. Tries the WordPress CMS, falls back to the bundled
 * data if the CMS is not configured or unreachable. Memoized for TTL ms.
 *
 * Returns: { data: { clientWork, products }, source: 'cms' | 'fallback' }
 */
export function loadProjects({ force = false } = {}) {
  const fresh = cache && !force && Date.now() - cache.at < TTL
  if (fresh) return Promise.resolve(cache)
  if (inflight && !force) return inflight

  if (!ENDPOINT) {
    cache = { data: fallbackData, source: 'fallback', at: Date.now() }
    return Promise.resolve(cache)
  }

  inflight = fetchFromCms()
    .then((data) => {
      // An empty CMS shouldn't blank the site — keep the fallback if nothing came back.
      const empty = data.clientWork.length === 0 && data.products.length === 0
      cache = empty
        ? { data: fallbackData, source: 'fallback', at: Date.now() }
        : { data, source: 'cms', at: Date.now() }
      return cache
    })
    .catch((err) => {
      if (import.meta.env.DEV) console.warn('[cms] falling back to bundled data:', err.message)
      cache = { data: fallbackData, source: 'fallback', at: Date.now() }
      return cache
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}
