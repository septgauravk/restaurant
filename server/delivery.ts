import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { storageGetSignedUrl } from "./storage";
import { consumeDeliveryTokenRecord, insertDeliveryToken, recordWebhookEvent } from "./supabase";

const TOKEN_TTL_MS = 72 * 60 * 60 * 1000;
const SUPPORT_EMAIL = "hey.dishprompt@zohomail.in";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyRazorpayWebhook(rawBody: Buffer, signature: string | undefined) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(signature, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function createDeliveryToken(email: string) {
  const storageKey = process.env.DISHPROMPT_PDF_STORAGE_KEY;
  if (!storageKey || !email) throw new Error("Delivery is not configured");
  const token = randomBytes(32).toString("base64url");
  await insertDeliveryToken({
    tokenHash: hashToken(token),
    email: email.toLowerCase().trim(),
    storageKey,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });
  return token;
}

export async function consumeDeliveryToken(token: string) {
  return consumeDeliveryTokenRecord(hashToken(token));
}

export type DeliveryEmailPayload = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
};

export function buildDeliveryEmail({ email, token, paymentId, appUrl, from }: { email: string; token: string; paymentId?: string; appUrl: string; from: string }): DeliveryEmailPayload {
  const downloadUrl = `${appUrl.replace(/\/$/, "")}/api/pdf-download?token=${encodeURIComponent(token)}`;
  const subject = "Your DishPrompt PDF is ready — secure download inside";
  const paymentLine = paymentId ? `<p style="margin:0 0 18px;color:#5b5b5b;font-size:13px">Payment reference: <strong>${paymentId}</strong></p>` : "";
  const text = [
    "Namaste,",
    "",
    "Your DishPrompt PDF purchase was successful. Your secure download link is ready:",
    downloadUrl,
    "",
    "This link can be used once and expires in 72 hours.",
    paymentId ? `Payment reference: ${paymentId}` : "",
    "",
    `Need help? Email ${SUPPORT_EMAIL}.`,
    "",
    "Thank you,",
    "DishPrompt",
  ].filter(Boolean).join("\n");
  const html = `<!doctype html><html><body style="margin:0;background:#f8f3ed;font-family:Arial,sans-serif;color:#191919"><div style="max-width:560px;margin:32px auto;padding:0 16px"><div style="background:#ffffff;border:1px solid #e7ddd2;padding:32px"><p style="margin:0 0 22px;color:#276b50;font-weight:700;font-size:20px">DishPrompt</p><p style="margin:0 0 16px;font-size:16px">Namaste,</p><p style="margin:0 0 18px;color:#444;line-height:1.6">Your DishPrompt PDF purchase was successful. Your secure download link is ready.</p>${paymentLine}<p style="margin:24px 0"><a href="${downloadUrl}" style="display:inline-block;padding:14px 22px;background:#f05b0a;color:#ffffff;text-decoration:none;font-weight:700">Download your PDF</a></p><p style="margin:0 0 16px;color:#666;font-size:13px;line-height:1.6"><strong>One-time link:</strong> This link can be used once and expires in 72 hours.</p><p style="margin:22px 0 0;padding-top:18px;border-top:1px solid #eee5dc;color:#666;font-size:13px;line-height:1.6">Need help? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#276b50">${SUPPORT_EMAIL}</a>.</p><p style="margin:22px 0 0;color:#444;font-size:13px">Thank you,<br /><strong>DishPrompt</strong></p></div></div></body></html>`;
  return { from, to: [email], reply_to: SUPPORT_EMAIL, subject, html, text };
}

export async function sendDeliveryEmail(email: string, token: string, paymentId?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.PUBLIC_APP_URL;
  if (!apiKey || !appUrl) throw new Error("Email delivery is not configured");
  const payload = buildDeliveryEmail({ email, token, paymentId, appUrl, from: process.env.EMAIL_FROM || SUPPORT_EMAIL });
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Email provider failed: ${response.status}`);
}

export async function handleRazorpayWebhook(req: Request, res: Response) {
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");
  if (!verifyRazorpayWebhook(rawBody, req.header("X-Razorpay-Signature"))) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }
  let event: any;
  try { event = JSON.parse(rawBody.toString("utf8")); } catch { return res.status(400).json({ error: "Invalid JSON" }); }
  if (event.event !== "payment_link.paid") return res.status(200).json({ received: true });
  const eventId = req.header("x-razorpay-event-id");
  if (!eventId) return res.status(500).json({ error: "Razorpay event ID is missing" });
  try {
    const result = await recordWebhookEvent(eventId, event.event);
    if (result.duplicate) return res.status(200).json({ received: true, duplicate: true });
  } catch {
    return res.status(500).json({ error: "Delivery database is not configured" });
  }
  const customer = event.payload?.payment_link?.entity?.customer;
  const email = customer?.email || event.payload?.payment?.entity?.email;
  if (!email) return res.status(422).json({ error: "Payment email missing" });
  try {
    const token = await createDeliveryToken(email);
    await sendDeliveryEmail(email, token, event.payload?.payment?.entity?.id);
  } catch (error) {
    console.error("[Delivery] Fulfillment failed", error);
    return res.status(500).json({ error: "Fulfillment failed" });
  }
  return res.status(200).json({ received: true });
}

export async function handlePdfDownload(req: Request, res: Response) {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  const delivery = await consumeDeliveryToken(token);
  if (!delivery) return res.status(410).send("This PDF link is expired or has already been used.");
  const signedUrl = await storageGetSignedUrl(delivery.storage_key);
  res.setHeader("Cache-Control", "no-store");
  return res.redirect(302, signedUrl);
}
