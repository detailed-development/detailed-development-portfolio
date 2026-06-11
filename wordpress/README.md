# Portfolio CMS (WordPress, headless)

This folder holds **DD Portfolio CMS** — a self-contained WordPress plugin that turns a
WordPress install into the backend for the React portfolio site. You edit projects in
`wp-admin`; the React site reads them at runtime over the REST API.

No ACF or other plugins required.

## How it fits together

```
wp-admin (you)                          React site (visitors)
  └─ Projects CPT  ──►  /wp-json/dd/v1/projects  ──►  fetch at runtime
     • add / edit / reorder                            (falls back to bundled
     • publish = show, draft = hide                     data if CMS is down)
     • featured image = photo
```

## One-time setup

1. **Stand up WordPress on a subdomain**, e.g. `cms.detaileddevelopment.com`
   (any host that runs WordPress — same box as nothing else needed).
2. **Install the plugin:** zip the `dd-portfolio-cms` folder and upload it under
   *Plugins → Add New → Upload Plugin*, then **Activate**.
   - On activation it seeds your current 3 client sites + 4 products so the API
     isn't empty. Delete or edit them freely.
3. **Allow the frontend to read it:** go to *Projects → API Settings* and add your
   site origin(s), one per line, e.g.
   ```
   https://detaileddevelopment.com
   https://www.detaileddevelopment.com
   http://localhost:5173        ← for local dev
   ```
   (Or enter `*` — the data is public read-only anyway.)
4. **Point the React app at it:** in the site repo, copy `.env.example` to `.env`
   and set:
   ```
   VITE_CMS_URL=https://cms.detaileddevelopment.com
   ```
   Restart `npm run dev` / rebuild. Done.

## Daily use

- **Add a project:** *Projects → Add Project*. Fill in the Project Details box,
  set the **Featured Image** for the photo, **Publish**.
- **Hide a project:** switch its status to **Draft** (Quick Edit works too). Only
  Published projects appear on the site.
- **Edit info:** open the project, change fields, Update. Live within ~1 minute
  (the API sends a 60s cache header).
- **Change the photo:** set/replace the Featured Image.
- **Reorder:** set the **Order** value under Page Attributes (lower = first).
- **Client vs Product:** the **Group** dropdown decides which grid it lands in.
  Clients get a detail page; Products are compact cards that link out.

## The API shape

`GET /wp-json/dd/v1/projects` →

```json
{
  "client": [
    {
      "slug": "gateway-bible-church",
      "name": "Gateway Bible Church",
      "industry": "Church / Community",
      "stack": ["WordPress", "Astra", "Elementor"],
      "summary": "…",
      "bullets": ["…", "…"],
      "description": "…",
      "url": "https://gatewaybiblechurch.org",
      "image": { "url": "https://cms.…/uploads/…jpg", "alt": "…" }
    }
  ],
  "products": [
    {
      "slug": "event-calendar",
      "name": "Event Calendar",
      "industry": "WordPress Plugin",
      "stack": ["PHP", "JavaScript", "WordPress"],
      "summary": "…",
      "bullets": [],
      "description": "",
      "url": "https://github.com/…",
      "image": null
    }
  ]
}
```

`url` is `null` for a product with no link (renders as "Private Repository").
`image` is `null` when there's no featured image (the site shows a letter tile).
