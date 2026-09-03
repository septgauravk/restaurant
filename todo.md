# DishPrompt website tasks

- [x] Reframe the existing research project as the DishPrompt sales landing page.
- [x] Generate or select brand assets and food imagery using the requested saffron/cream/green palette.
- [x] Implement Hinglish hero, benefits, workflow, examples, pricing, FAQ, and mobile navigation.
- [x] Add a Razorpay Payment Link integration point for the ₹999 PDF purchase.
- [x] Add a thank-you/download handoff and clear setup instructions for the PDF delivery URL.
- [x] Verify desktop/mobile behavior, build, and Vercel compatibility.
- [x] Save a checkpoint and deliver the preview/project version.

Checkpoint note: DishPrompt storefront verified at desktop and mobile widths; build and TypeScript checks pass. Razorpay remains configured through the public Payment Link constant.

## Support and delivery update

- [x] Add hey.dishprompt@zohomail.in as the visible support contact.
- [x] Add a prewritten customer email template for payment or download help.
- [x] Document the secure Razorpay webhook-to-email/PDF delivery architecture.
- [x] Update the storefront copy to explain instant delivery and support fallback.
- [x] Verify the updated page and build.

## Results page and asset folder update

- [x] Add a dedicated results page with three image examples.
- [x] Create one clearly named public upload folder for logo, favicon, OG, hero, and result assets.
- [x] Update all website image references to use the centralized asset paths.
- [x] Add replacement instructions and an asset manifest.
- [x] Verify route navigation, mobile layout, and production build.

## Security and Vercel readiness

- [x] Read the full-stack implementation guidance before adding server-side webhook support.
- [x] Verify Razorpay webhook and signature requirements from official documentation.
- [x] Add a server-side webhook handler that validates signatures and prevents duplicate fulfillment.
- [x] Add PDF delivery/email provider configuration placeholders without exposing secrets.
- [x] Add Vercel deployment configuration and security headers.
- [x] Preview the site on mobile and test the checkout entry without a real transaction.
- [x] Save the verified checkpoint and deliver setup instructions. Checkpoint remains blocked by the expired project Git synchronization token; delivery instructions are documented.

## Post-payment options

- [x] Add a payment-success page with Download PDF and Email PDF choices.
- [x] Keep the download URL configurable and avoid exposing payment secrets in frontend code.
- [x] Add support fallback and mobile-friendly copy for the success page.
- [x] Verify the new route and production build.

## One-time protected delivery and Vercel deployment

- [x] Replace the typed-email success flow with no-typing, verified-payment delivery actions.
- [x] Add one-time expiring download tokens with server-side storage and replay protection.
- [x] Add server-side verified Razorpay webhook fulfillment and email delivery scaffolding.
- [x] Add Vercel-compatible API/deployment configuration and security headers.
- [x] Document the exact secret setup and PDF storage requirements.
- [x] Preview the entire site on mobile and test homepage to payment-success journey.
- [x] Diagnose and document the expired Git synchronization-token recovery path.

## Confirmed implementation scope

- [x] Implement one-time no-typing download and email choices.
- [x] Implement secure Razorpay webhook signature verification and idempotent fulfillment scaffolding.
- [x] Implement protected one-time PDF token issuance and consumption.
- [x] Add Vercel configuration and security headers.
- [x] Add manual secret setup documentation.
- [x] Test the homepage-to-payment-success journey on mobile.

## Vercel route fallback completion

- [x] Add direct-load SPA fallbacks for `/results`, `/payment-success`, and `/404` without intercepting API routes.
- [ ] Verify the final Vercel deployment itself; this requires connecting the repository and deploying from the user’s Vercel account. Local build and Vercel configuration are verified, but a live Vercel deployment requires the user’s Vercel account.

## Email template review

- [x] Refine the Resend subject line and PDF delivery email for professional tone, clarity, mobile readability, and sender trust.
- [x] Add a plain-text alternative and reply-to support address.
- [x] Validate the updated email delivery code and tests.

## Resend review and Supabase migration

- [x] Review and refine the Resend subject line and transactional email body.
- [x] Replace delivery-token persistence with Supabase server-side storage.
- [x] Replace processed-webhook-event persistence with Supabase server-side storage.
- [x] Add Supabase schema/configuration documentation without exposing secrets.
- [x] Add or update tests for email payload and Supabase persistence boundaries.
- [x] Run TypeScript, unit tests, and production build.

## Environment-variable setup guide

- [x] Inventory every environment variable referenced by the current frontend, server, Vercel configuration, and delivery docs.
- [x] Create a single beginner-friendly Vercel environment-variable setup file with public/server-only labels.
- [x] Document Supabase, Razorpay, Resend, PDF storage, sender-domain, and callback setup steps.
- [x] Cross-check every documented variable against the code and run validation.
