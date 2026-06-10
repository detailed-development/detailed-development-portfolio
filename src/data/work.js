export const clientWork = [
  {
    slug: 'gateway-bible-church',
    name: 'Gateway Bible Church',
    industry: 'Church / Community',
    stack: ['WordPress', 'Astra', 'Elementor'],
    summary:
      'A clear digital front door for a local church — service times, events, giving, and sermons without the maze.',
    bullets: [
      'Visitor-first pathways: plan your visit, service times, and this week at a glance',
      'Online giving, prayer request forms, and e-bulletin content',
      'YouTube sermon integration and a recurring events setup the staff can update themselves',
    ],
    description:
      'Gateway needed a site that worked for two very different visitors: someone checking service times on a Saturday night, and a long-time member looking for the e-bulletin. We organized everything around what people actually come to do — visit, watch, give, connect — and built it so the church staff can update content without calling us.',
    url: 'https://gatewaybiblechurch.org',
  },
  {
    slug: 'heidis-village',
    name: "Heidi's Village",
    industry: 'Animal Welfare Nonprofit',
    stack: ['WordPress', 'Elementor'],
    summary:
      'A nonprofit animal welfare site built around the four things that keep the lights on: donate, adopt, foster, volunteer.',
    bullets: [
      'Donation pathways that are never more than one click away',
      'Adoption, foster, volunteer, and rescue-partner flows with clear next steps',
      'Impact stats, news, and events woven into the organizational story',
    ],
    description:
      "Heidi's Village does a lot — sheltering, veterinary care, rescue partnerships, community programs. The challenge was architecture: surfacing donation and adoption pathways everywhere without burying the mission storytelling that builds trust. We structured a large content footprint so every page leads somewhere useful.",
    url: 'https://heidisvillage.org',
  },
  {
    slug: 'circuit-az',
    name: 'Circuit AZ',
    industry: 'Music / Events',
    stack: ['WordPress', 'Elementor'],
    summary:
      'An Arizona electronic music brand — events, media, shop, and every streaming platform link in one place.',
    bullets: [
      'Upcoming and past event promotion with a visual-first layout',
      'Media gallery, shop pathway, and music platform integrations',
      'A brand experience that feels like the events, not a brochure',
    ],
    description:
      "An events brand lives or dies on energy, and most event websites have none. Circuit AZ's site leads with visuals — event art, media, the brand itself — while keeping the practical stuff (tickets, dates, socials, shop) one tap away. Built to be updated fast between shows.",
    url: 'https://circuitaz.com',
  },
]

export const products = [
  {
    slug: 'event-calendar',
    name: 'Event Calendar',
    industry: 'WordPress Plugin',
    stack: ['PHP', 'JavaScript', 'WordPress'],
    summary:
      "A calendar plugin that doesn't make you want to close the tab. Filtering, search, responsive — the whole deal.",
    link: 'https://github.com/detailed-development/event-calendar',
  },
  {
    slug: 'client-store-locator',
    name: 'Client Store Locator',
    industry: 'WordPress Plugin',
    stack: ['PHP', 'Google Maps API', 'WordPress'],
    summary:
      'Interactive map with proximity search and custom markers. Turns out people really do want to find the nearest location.',
    link: 'https://github.com/detailed-development/client-store-locator',
  },
  {
    slug: 'internal-social-dashboard',
    name: 'Internal Social Dashboard',
    industry: 'Web Application',
    stack: ['React', 'Node.js', 'APIs'],
    summary:
      'One screen to see how content is performing across platforms. Replaced a very sad collection of bookmarked analytics pages.',
    link: 'https://github.com/detailed-development/internal-social-dashboard',
  },
  {
    slug: 'party-favor',
    name: 'Party Favor',
    industry: 'iOS App',
    stack: ['Swift', 'SwiftUI', 'iOS'],
    summary:
      "An iOS app we're working on. Can't say too much yet, but we're pretty excited about this one.",
    link: null,
  },
]

export function findClientWork(slug) {
  return clientWork.find((p) => p.slug === slug)
}
