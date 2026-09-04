# MEBRI DESIGN

React/Vite portfolio site for Mebri Design. The public site reads projects and contact settings from Supabase. The admin page authenticates with Supabase, uploads images through a protected Vercel function, and stores public Cloudflare R2 URLs in Supabase.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the values.
2. Install dependencies with `npm install`.
3. Apply `supabase/projects.sql` and `supabase/contact_inquiries.sql` in the new Supabase SQL editor.
4. The SQL files are configured for `englishpractice265@gmail.com`; update that email in both files if the admin account changes.
5. Start the site with `npm run dev`.

The admin email must match `VITE_ADMIN_EMAIL`, `ADMIN_EMAIL`, and the email in the Supabase RLS policies.

## GitHub and Vercel

Push this folder to a new GitHub repository, then import that repository into a new Vercel project. Vercel should detect Vite automatically:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Add every variable from `.env.example` to Vercel for Production, Preview, and Development. Keep the R2 access key and secret server-only; they must never have a `VITE_` prefix.

## Supabase

Create a new Supabase project and an Auth user whose email matches the configured admin email. Run both SQL scripts in the Supabase SQL editor. The scripts create the projects, contact settings, and inquiry tables with public read/insert policies where needed and admin-only write/read policies.

The public Supabase URL and anon/publishable key are safe to use in the browser. Do not put a Supabase service-role key in Vercel client variables or source control.

## Cloudflare R2

Create a private R2 bucket and an R2 API token with permission to write objects to that bucket. Configure a public `r2.dev` URL or custom domain for `R2_PUBLIC_URL`. Uploads are written under `projects/` by the Vercel function.

Configure this CORS policy on the bucket, replacing the production URL with the final Vercel domain:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://your-vercel-domain.example.com"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3600
  }
]
```

## Checks

```text
npm run lint
npm run typecheck
npm run build
```
