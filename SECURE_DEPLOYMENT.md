# DishPrompt secure deployment and PDF delivery

## Customer journey

After a successful Razorpay Payment Link payment, Razorpay sends the `payment_link.paid` webhook to the server. The server validates `X-Razorpay-Signature` over the raw request body, rejects duplicates using `x-razorpay-event-id`, creates a random one-time token whose SHA-256 hash is stored in the database, and emails the customer a link. The customer does not type an email address. The link points to `/api/pdf-download?token=...`, expires after 72 hours, and becomes unusable after the first successful consumption.

The `/payment-success` page is the customer-facing fallback. It offers **Download PDF once** when a valid token is present and **Email PDF to me** as a prefilled support fallback. It must not be treated as proof of payment by itself.

## Razorpay Dashboard setup

Create a Payment Link for exactly ₹999. Set the success callback URL to:

```text
https://YOUR_DOMAIN/payment-success
```

In Razorpay Dashboard, open **Account & Settings → Webhooks**, create a webhook URL:

```text
https://YOUR_DOMAIN/api/razorpay/webhook
```

Use a strong random webhook secret and subscribe to `payment_link.paid`. Test it in Razorpay Test Mode first. Razorpay requires signature verification against the raw request body and may retry events, so the implementation uses HMAC-SHA256 validation plus event-id idempotency.

## Vercel secrets

Add these under **Vercel Project → Settings → Environment Variables** for Preview and Production. Never put them in React code or commit them.

| Variable | Value |
|---|---|
| `RAZORPAY_WEBHOOK_SECRET` | The secret configured for the Razorpay webhook, not the Razorpay Key Secret. |
| `RESEND_API_KEY` | A server-side Resend API key. Verify the sending domain/address before production. |
| `DISHPROMPT_PDF_STORAGE_KEY` | The private storage key for the PDF, such as `products/dishprompt.pdf`. |
| `PUBLIC_APP_URL` | Your full HTTPS Vercel URL, without a trailing slash. |
| `EMAIL_FROM` | A verified sender address. It can be `hey.dishprompt@zohomail.in` only after the email provider verifies it. |
| `VITE_RAZORPAY_PAYMENT_LINK` | The public ₹999 Razorpay Payment Link. This is the only payment value safe to expose in the browser. |

The current placeholder in the purchase button must be replaced with the real public Razorpay Payment Link. Keep `RAZORPAY_WEBHOOK_SECRET`, `RESEND_API_KEY`, and the private PDF storage key server-only.

## Secure PDF storage

Upload the PDF to private object storage and set `DISHPROMPT_PDF_STORAGE_KEY` to its storage key. Do not publish the master PDF in `client/public`, GitHub, or a permanent public URL. The protected route consumes the token atomically before redirecting to a signed storage URL. If a customer shares the final signed storage URL, its lifetime is controlled by storage; for the strictest anti-sharing behavior, stream the file through the protected route rather than redirecting.

## Vercel deployment note

The repository includes `vercel.json` with the build command, static output directory, and security headers. Because secure webhooks require server-side execution, deploy the full-stack server/API portion rather than only uploading `dist/public` as a static folder. If your Vercel project is configured as a pure Vite static deployment, keep the frontend there and deploy `/api/razorpay/webhook` and `/api/pdf-download` as Vercel Functions or on another HTTPS server. A static-only deployment cannot validate webhooks, consume one-time tokens, or send email.

## Git synchronization token recovery

The project checkpoint failure is from the Manus project remote, not Vercel: the remote returned `403 Invalid or expired token`. Do not rotate Razorpay keys to fix this. In the Management UI, refresh or reconnect the project/Git synchronization connection, then create a new checkpoint. If the project is exported to GitHub, create a new repository connection or re-authorize the GitHub/Vercel integration, confirm the repository and branch are correct, and import the repository into Vercel directly. The Vercel deployment can use the GitHub repository even while the Manus checkpoint remote is being repaired.

## Sources

- [Razorpay Payment Link webhook events](https://razorpay.com/docs/webhooks/payment-links/)
- [Razorpay webhook validation and idempotency](https://razorpay.com/docs/webhooks/validate-test/)
- [Razorpay Payment Link callback URL](https://razorpay.com/docs/api/payments/payment-links/create-standard/)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Vercel raw request body guidance](https://vercel.com/kb/guide/how-do-i-get-the-raw-body-of-a-serverless-function)

## Supabase database setup

The delivery layer now uses Supabase Postgres for `delivery_tokens` and `processed_webhook_events`. Run `supabase_schema.sql` once in the Supabase Dashboard SQL Editor. Row Level Security is enabled with no public policies; the server uses `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS and must never be exposed to the browser.

Add these server-only values in Vercel:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Private server key for delivery writes and one-time token consumption. |

The Resend subject is `Your DishPrompt PDF is ready — secure download inside`. The email includes a branded download CTA, payment reference when available, one-time/72-hour expiry language, a plain-text fallback, and `reply_to` set to `hey.dishprompt@zohomail.in`. Use a verified `EMAIL_FROM` address for production sending.

## Complete environment-variable guide

For a beginner-friendly inventory of every frontend, server, Supabase, Razorpay, Resend, PDF-storage, and Vercel variable, see `ENVIRONMENT_SETUP.md`. It labels each value as public or server-only and gives the exact dashboard location where it is created.
