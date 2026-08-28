# MEBRI-DESIGN

a resposive web app for a fashion designer programed with react-js and tailwind-css

## Image uploads

The Admin page uploads image files directly to Cloudflare R2 through the protected `/api/r2-upload-url` Vercel function. Supabase stores the project text and the resulting public image URLs.

Set these variables in Vercel for the Production, Preview, and Development environments:

```text
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-public-r2-domain.example.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

`R2_PUBLIC_URL` must be the bucket's public `r2.dev` URL or a configured custom domain. Never expose the R2 access key or secret in a `VITE_` variable.

Use this CORS policy in the R2 bucket:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://mebri-design-baggy-outfit.vercel.app"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3600
  }
]
```
