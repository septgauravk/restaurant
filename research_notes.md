# Research notes

## Source-backed findings

1. USDA Foreign Agricultural Service, *Food Service - Hotel Restaurant Institutional Annual: India* (Report IN2025-0076, Dec. 31, 2025): India’s food-service industry is estimated at $85B in 2025 and projected to reach $140B by 2030, a 10.4% CAGR. The report describes more than 500,000 restaurant outlets, rapid growth in delivery, cloud kitchens, smaller-city expansion, and restaurant adoption of AI-based kitchens and smart ordering systems. It also states that full-service restaurants, QSRs, cloud kitchens, cafés and bars are all expanding, with cloud kitchens relying on delivery platforms such as Swiggy and Zomato.
URL: https://apps.fas.usda.gov/newgainapi/api/Report/DownloadReportByFileName?fileName=Food%20Service%20-%20Hotel%20Restaurant%20Institutional%20Annual_New%20Delhi_India_IN2025-0076.pdf

2. Google Business Profile Help, *Get started with a Business Profile for your restaurant*: Google explicitly positions restaurant profiles around business information, ordering links, menus, photos/videos of interior, exterior and dining experience, customer engagement, and performance metrics including searches and menu clicks. This supports a product promise focused on better visual merchandising, but does not prove that photos alone increase ranking or conversions.
URL: https://support.google.com/business/answer/14189260?hl=en

3. Google Business Profile Help, *Manage your Business Profile photos & videos*: Google’s photo guidance says images should be in focus, well lit, and not significantly altered or excessively filtered; images should represent reality. Any AI-image product should therefore be framed as enhancement/creative marketing for clearly labeled promotional use, not as a deceptive substitute for the actual dish.
URL: https://support.google.com/business/answer/6103862?hl=en&co=GENIE.Platform%3DDesktop

4. Razorpay Docs, *About Payment Links*: Payment Links can accept payments without a website or app, be shared via email/SMS/social, support cards, UPI, netbanking and more, and expose webhook events for instant notifications. This makes Razorpay viable for payment collection, but a secure post-payment fulfillment flow still needs a backend or no-code automation rather than a public Google Drive URL alone.
URL: https://razorpay.com/docs/payments/payment-links/

5. Zomato partner page: Zomato presents restaurant partnership as a way to increase visibility, orders and operational support. Treat this as platform positioning, not independent proof of uplift.
URL: https://www.zomato.com/partner-with-us/new/

6. Swiggy investor relations / press materials: Swiggy publishes annual reports, shareholder letters and KPI materials. Use official filings for any current partner/user numbers; avoid repeating third-party market-share claims without a primary source.
URL: https://www.swiggy.com/corporate/investor-relations/reports-and-publications/

## Product implications

- Strong market rationale: a large and expanding restaurant sector plus platform-dependent digital discovery creates a credible need for reusable visual assets.
- Responsible promise: “turn a real dish photo into polished marketing variations” is safer than promising that AI can invent an accurate dish or improve Google ranking.
- Offer design: low-ticket prompt pack can be a lead product, with a higher-value assisted setup for 10 signature dishes, consistency templates, menu resizing, and WhatsApp support.
- Funnel: one mobile-first landing page, sample gallery, clear limitations, payment link, and gated fulfillment. Collect only restaurant name, city, WhatsApp/email, cuisine, and intended use.
- Fulfillment: Razorpay payment success -> webhook/no-code automation -> unique expiring download link -> email + WhatsApp confirmation. Do not expose the master PDF through a permanent public link.
- Research caveat: no independent evidence yet proves that better food images alone increase orders; the site should describe this as a testable hypothesis and recommend measurement through menu clicks, profile actions, inquiry rate, and conversion by image variant.

## Open questions to investigate next

- Current Indian internet/WhatsApp usage and smartphone reach for mobile-first design.
- Current AI tool availability and commercial-use terms for the recommended free/cheap workflow.
- India-specific consumer protection, privacy, consent, and GST/invoicing considerations for collecting restaurant owner data and selling a digital PDF.
- Price sensitivity and competitive alternatives (photographer, freelancer, agency, DIY AI tools).

7. Google AI for Developers, *Generate images using Imagen*: Google describes Imagen as a high-fidelity image generation model; the page says generated images include a SynthID watermark. It also says Imagen models were deprecated and scheduled to shut down on Aug. 17, 2026, with migration recommended to Nano Banana / Gemini image generation. The product should therefore avoid hard-coding a single model or promising a permanent free tier; describe the workflow as “Google’s current image-generation tool” and maintain a tool-version update path.
URL: https://ai.google.dev/gemini-api/docs/imagen

8. Google Business Profile photo guidance: Google’s official restaurant setup and photo guidance are the relevant policy baseline. AI-enhanced images should be used for promotional/editorial contexts or clearly represent the actual dish; the site should not encourage deceptive edits that materially misrepresent portion, ingredients or availability.
URL: https://support.google.com/business/answer/6103862?hl=en&co=GENIE.Platform%3DDesktop

9. Privacy and tax: The research found no single official, plain-language source sufficient to give a definitive tax or legal conclusion for this offer. The site should recommend a short privacy notice, explicit consent for WhatsApp/email follow-up, data minimization, an unsubscribe/delete route, and advice from an Indian CA/lawyer on GST, invoicing and platform terms before launch. These are implementation safeguards, not legal advice.

## Positioning conclusion

The opportunity is credible, but the defensible product is not “AI makes fake food photos.” It is a repeatable, low-friction visual merchandising workflow for real dishes: prompt + input guidance + consistent style recipes + channel-ready crops + a measurement plan. The first launch should test willingness to pay and operational usefulness, not claim ranking or order uplift.

## Proposed experiment

Run a 14-day pilot with 10 restaurants across at least two city tiers and three cuisine types. Baseline each restaurant’s existing hero image, menu clicks, profile actions and inbound inquiries for 7 days; provide a prompt pack and standardized image checklist; then compare the next 7 days while keeping price, menu and offer constant. Record failure modes (dish fidelity, text artifacts, time to first usable image) and collect opt-in qualitative feedback rather than fabricated testimonials.

## Razorpay webhook verification (Sep 2026)

Official docs confirm Payment Link events include `payment_link.paid`; Razorpay also supports callback URLs for post-payment redirects. Webhook validation must use the raw request body and compare the HMAC-SHA256 signature from `X-Razorpay-Signature` using the configured webhook secret. Duplicate deliveries are expected; use the unique `x-razorpay-event-id` header for idempotency. Test events can be sent in Razorpay Test mode before production.

Sources:
- https://razorpay.com/docs/webhooks/payment-links/
- https://razorpay.com/docs/webhooks/validate-test/
- https://razorpay.com/docs/api/payments/payment-links/create-standard/
- https://razorpay.com/docs/payments/payment-links/
