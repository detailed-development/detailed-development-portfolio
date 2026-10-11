# Portfolio CMS (WordPress, headless)

This folder holds **DD Portfolio CMS** — a self-contained WordPress plugin that turns a
WordPress install into the backend for the React portfolio site. You edit projects in
`wp-admin`; the React site reads them at runtime over the REST API.

No ACF or other plugins required. Version 1.1.0 also adds a private contact inbox
for the minimal landing page.

## How it fits together

```
wp-admin (you)                          React site (visitors)
  └─ Projects CPT  ──►  /wp-json/dd/v1/projects  ──►  fetch at runtime
     • add / edit / reorder                            (falls back to bundled
     • publish = show, draft = hide                     data if CMS is down)
     • featured image = photo
```

## One-time setup

1. **Stand up WordPress on a subdomain**, `admin.detailed-development.com`
   (any host that runs WordPress — same box as nothing else needed).
2. **Install the plugin:** zip the `dd-portfolio-cms` folder and upload it under
   *Plugins → Add New → Upload Plugin*, then **Activate**.
   - On activation it seeds your current 3 client sites + 4 products so the API
     isn't empty. Delete or edit them freely.
3. **Allow the frontend to read it:** go to *Projects → API Settings* and add your
   site origin(s), one per line, e.g.
   ```
   https://detailed-development.com
   https://www.detailed-development.com
   http://localhost:5173        ← for local dev
   ```
   (Or enter `*` — the data is public read-only anyway.)
4. **Point the React app at it:** in the site repo, copy `.env.example` to `.env`
   and set:
   ```
   VITE_CMS_URL=https://admin.detailed-development.com
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

## Contact inbox and notifications

The landing-page popup sends name (optional), email, and message to
`POST /wp-json/dd/v1/contact`. Requests are saved as private records, visible only
to users with `manage_options` (normally administrators), under **Projects → Contact
Requests**. They have no public page or REST read endpoint. Open a request to mark
it read, and use its email link to reply. Use Trash to remove a request.

The form shows success only after WordPress saves the record. It retains entered
text on a failure and includes a direct email link. A filled honeypot is discarded;
the endpoint validates types and lengths, checks the allowed browser origin, and
limits each remote IP to five attempts per 15 minutes. Only a short-lived salted
hash of the IP is stored for this limit. Retrying the same request ID returns the
saved result without creating another record or email.

Email notifications to `anthony@detailed-development.com` are enabled by default.
The plugin attempts them **after saving**, using WordPress's built-in `wp_mail()`.
No WP Mail SMTP setup is needed for storing requests. Notification delivery depends
on the host's mail transport, and even a successful mail call does not confirm
inbox delivery. The request list records accepted, failed, or disabled notifications.
Turn notifications off in **Projects → API Settings** to use only the inbox.

### Updating the installed plugin

1. Zip the `dd-portfolio-cms` folder, including its new `includes/contact.php` file.
2. In WordPress, upload it through **Plugins → Add New → Upload Plugin**, then
   choose **Replace current with uploaded**. Existing projects are preserved.
3. In **Projects → API Settings**, include the deployed frontend's exact origin
   (and `http://127.0.0.1:5173` for this local preview) in **Allowed frontend origins**.
4. Deploy the React build with `VITE_CMS_URL=https://admin.detailed-development.com`.
5. Submit one test request from the deployed page, then verify it appears in
   **Projects → Contact Requests**. Check the inbox even if no email arrives.

To run the backend contract checks without a WordPress install:

```bash
php wordpress/tests/contact.php
```

These checks use WordPress stubs to exercise validation, privacy configuration,
storage failures, spam limits, retry behavior, and mail failures. A live submission
after installing the plugin is still required to verify the host's database,
CORS configuration, and optional email transport together.

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
      "image": { "url": "https://admin.…/uploads/…jpg", "alt": "…" }
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
