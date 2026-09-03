import { ArrowLeft, Download, Mail, ShieldCheck } from "lucide-react";

const SUPPORT_EMAIL = "hey.dishprompt@zohomail.in";
const token = new URLSearchParams(window.location.search).get("token");
const downloadUrl = token ? `/api/pdf-download?token=${encodeURIComponent(token)}` : "";
const emailBody = `Namaste DishPrompt team,%0A%0AMera DishPrompt PDF payment complete ho gaya hai. Mujhe PDF email kar dijiye.%0A%0ARazorpay Payment ID: ${new URLSearchParams(window.location.search).get("razorpay_payment_id") || ""}%0A%0AThank you`;

function downloadPdf() {
  if (!downloadUrl) {
    window.alert("Secure download link aapke payment email par bheja gaya hai. Email check karein; help ke liye hey.dishprompt@zohomail.in par contact karein.");
    return;
  }
  window.location.href = downloadUrl;
}

export default function PaymentSuccess() {
  return (
    <main className="payment-success-page">
      <div className="payment-success-shell">
        <a className="success-back" href="/"><ArrowLeft size={16} /> Back to DishPrompt</a>
        <div className="success-brand"><span>DishPrompt</span><small>Better dish photos. Less hassle.</small></div>
        <section className="success-panel" aria-labelledby="success-title">
          <div className="success-check"><ShieldCheck size={28} /></div>
          <div className="section-kicker">Payment complete</div>
          <h1 id="success-title">Aapka DishPrompt PDF ready hai.</h1>
          <p>Ab aap apna PDF download kar sakte ho ya email par link maang sakte ho. Razorpay Payment ID ko safe rakhein.</p>
          <div className="success-actions">
            <button className="success-primary" onClick={downloadPdf}><Download size={18} /> Download PDF once</button>
            <a className="success-secondary" href={`mailto:${SUPPORT_EMAIL}?subject=DishPrompt%20PDF%20delivery&body=${emailBody}`}><Mail size={18} /> Email PDF to me</a>
          </div>
          <div className="success-note">Payment email par secure link automatically bheja jayega. Email option sirf backup hai—message already filled hai, aapko kuch type nahi karna. Card number, CVV ya OTP email na karein.</div>
        </section>
      </div>
    </main>
  );
}
