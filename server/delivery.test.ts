import { afterEach, describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { buildDeliveryEmail, verifyRazorpayWebhook } from "./delivery";

afterEach(() => {
  delete process.env.RAZORPAY_WEBHOOK_SECRET;
});

describe("Razorpay webhook verification", () => {
  it("accepts an HMAC-SHA256 signature over the raw body", () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = "test-secret";
    const body = Buffer.from('{"event":"payment_link.paid"}');
    const signature = createHmac("sha256", "test-secret").update(body).digest("hex");
    expect(verifyRazorpayWebhook(body, signature)).toBe(true);
  });

  it("rejects missing or incorrect signatures", () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = "test-secret";
    const body = Buffer.from('{"event":"payment_link.paid"}');
    expect(verifyRazorpayWebhook(body, undefined)).toBe(false);
    expect(verifyRazorpayWebhook(body, "not-valid")).toBe(false);
  });
});

describe("Resend delivery email", () => {
  it("builds a professional, mobile-friendly payload with a one-time link", () => {
    const payload = buildDeliveryEmail({
      email: "owner@example.com",
      token: "secure-token",
      paymentId: "pay_123",
      appUrl: "https://dishprompt.example/",
      from: "DishPrompt <hello@dishprompt.example>",
    });

    expect(payload.subject).toBe("Your DishPrompt PDF is ready — secure download inside");
    expect(payload.to).toEqual(["owner@example.com"]);
    expect(payload.reply_to).toBe("hey.dishprompt@zohomail.in");
    expect(payload.html).toContain("Download your PDF");
    expect(payload.html).toContain("expires in 72 hours");
    expect(payload.html).toContain("pay_123");
    expect(payload.text).toContain("https://dishprompt.example/api/pdf-download?token=secure-token");
    expect(payload.text).toContain("This link can be used once");
  });
});
