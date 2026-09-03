# DishPrompt environment setup guide

This file is the single setup checklist for deploying DishPrompt. Add values in **Vercel → Project → Settings → Environment Variables**. For each variable, select **Preview** and **Production** unless the table says otherwise. Never commit real values to GitHub and never place server secrets in React code.

## 1. Variables you must add yourself

| Variable | Visibility | Required? | What to enter | Where to get it |
|---|---|---:|---|---|
| `SUPABASE_URL` | Server-only | Yes | Your Supabase project URL, such as `https://your-project.supabase.co` | Supabase Dashboard → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Yes | The long service-role secret key | Supabase Dashboard → Project Settings → API → Service role key. Never expose this in the browser. |
| `RAZORPAY_WEBHOOK_SECRET` | Server-only | Yes | The exact secret configured for the Razorpay webhook | Razorpay Dashboard → Account & Settings → Webhooks. This is not the Razorpay Key Secret. |
| `RESEND_API_KEY` | Server-only | Yes | A Resend API key with permission to send email | Resend Dashboard → API Keys → Create API Key |
| `DISHPROMPT_PDF_STORAGE_KEY` | Server-only | Yes | The private object-storage key/path for the PDF, such as `products/dishprompt.pdf` | Your private S3-compatible storage or the project storage system |
| `PUBLIC_APP_URL` | Server-only | Yes | Your final HTTPS URL without a trailing slash, such as `https://dishprompt.vercel.app` | Your Vercel deployment URL or custom domain |
| `EMAIL_FROM` | Server-only | Yes | A verified sender, such as `DishPrompt <hello@yourdomain.com>` | Verify the sending domain/address in Resend first |
| `VITE_RAZORPAY_PAYMENT_LINK` | Public browser value | Yes | The public Razorpay Payment Link for the ₹999 product | Razorpay Dashboard → Payment Links |

The only value in this table intentionally exposed to the browser is `VITE_RAZORPAY_PAYMENT_LINK`. Everything else is read by server-side code only.

## 2. Variables already supplied by the Manus full-stack template

These are normally injected by the project environment. Do not create duplicate values unless your deployment provider asks for them.

| Variable | Used for | Action |
|---|---|---|
| `DATABASE_URL` | Existing template database/auth support | Keep available if the template database is still used elsewhere. Delivery tokens now use Supabase. |
| `JWT_SECRET` | Session-cookie signing | Keep server-only. |
| `OAUTH_SERVER_URL` | Manus OAuth server | Keep server-only if authentication remains enabled. |
| `OWNER_OPEN_ID` | Project owner identity | Keep server-only. |
| `OWNER_NAME` | Project owner display name | Keep server-only. |
| `BUILT_IN_FORGE_API_URL` | Built-in server integrations | Keep server-only if used by the template. |
| `BUILT_IN_FORGE_API_KEY` | Built-in server integrations | Keep server-only. |
| `VITE_APP_ID` | Frontend app identity | Public build value; normally already injected. |
| `VITE_OAUTH_PORTAL_URL` | Browser OAuth portal URL | Public browser value; normally already injected. |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend built-in API URL | Public browser value; normally already injected. |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend built-in API access | Public by design in this template; do not use it for private operations. |
| `VITE_ANALYTICS_ENDPOINT` | Optional analytics script endpoint | Usually already injected; leave empty if analytics is not wanted. |
| `VITE_ANALYTICS_WEBSITE_ID` | Optional analytics site ID | Usually already injected; leave empty if analytics is not wanted. |
| `VITE_APP_TITLE` | App title | Set to `DishPrompt` if you want to override the project title. |
| `VITE_APP_LOGO` | App logo configuration | Set only if the template’s global logo configuration is used. |
| `NODE_ENV` | Runtime mode | Vercel manages this; do not manually set it unless needed. |
| `PORT` | Local/server port | Vercel manages this; do not hardcode it. |

## 3. Supabase setup

First open Supabase Dashboard → **SQL Editor** and run the project file `supabase_schema.sql`. It creates `delivery_tokens` and `processed_webhook_events`, adds the required uniqueness/index constraints, and enables Row Level Security with no public policies.

Then add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel. The service-role key is used only by the server-side API functions and bypasses RLS. Do not create any browser/Vite-prefixed version of the service-role key.

## 4. Razorpay setup

Create a Payment Link for **₹999**. Set the success callback to:

```text
https://YOUR_DOMAIN/payment-success
```

Create a webhook pointing to:

```text
https://YOUR_DOMAIN/api/razorpay-webhook
```

Subscribe to `payment_link.paid`, create a strong webhook secret, and copy that same secret into `RAZORPAY_WEBHOOK_SECRET`. Test with Razorpay Test Mode before accepting live payments.

## 5. Resend setup

Create a Resend API key and verify the sender domain or sender address used in `EMAIL_FROM`. The current subject is:

```text
Your DishPrompt PDF is ready — secure download inside
```

The email contains a branded download button, payment reference, one-time/72-hour expiry language, a plain-text fallback, and `reply_to: hey.dishprompt@zohomail.in`.

## 6. Private PDF setup

Upload the PDF to private storage and set `DISHPROMPT_PDF_STORAGE_KEY` to the object key, not a public URL. The server creates a random token, stores only its SHA-256 hash in Supabase, consumes it atomically, and redirects once to a signed storage URL. For strictest anti-sharing behavior, stream the file through the protected endpoint instead of redirecting to storage.

## 7. Vercel configuration

Use the repository’s `vercel.json`. It defines:

| Setting | Value |
|---|---|
| Build command | `pnpm build` |
| Static output | `dist/public` |
| SPA fallbacks | `/results`, `/payment-success`, and `/404` → `/index.html` |
| API functions | `api/razorpay-webhook.ts` and `api/pdf-download.ts` |
| Security headers | `nosniff`, strict referrer policy, restricted permissions, frame denial, CSP |

After adding variables, redeploy. Then check the Vercel deployment directly at `/`, `/results`, and `/payment-success`. Do not treat local preview as proof that the Vercel environment variables are correct.

## 8. Final checklist

1. Run `supabase_schema.sql` in Supabase.
2. Add all eight DishPrompt-specific variables in Vercel Preview and Production.
3. Verify `EMAIL_FROM` in Resend.
4. Create the ₹999 Razorpay Payment Link.
5. Add the Razorpay webhook and match its secret exactly.
6. Deploy to Vercel.
7. Use Razorpay Test Mode to make a test payment.
8. Confirm the webhook creates one email and one expiring link.
9. Confirm the PDF link works once and returns an expired/already-used response on a second attempt.
10. Switch to live mode only after the complete test succeeds.

## Safety rules

Never email or paste card numbers, CVV, OTPs, Razorpay API secrets, Supabase service-role keys, or Resend API keys. If any secret is accidentally exposed, revoke it immediately and create a replacement.

## Official references

- [Supabase API keys](https://supabase.com/docs/guides/api/api-keys)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Razorpay Payment Link webhooks](https://razorpay.com/docs/webhooks/payment-links/)
- [Razorpay webhook validation](https://razorpay.com/docs/webhooks/validate-test/)
- [Resend API documentation](https://resend.com/docs/api-reference/emails/send-email)
