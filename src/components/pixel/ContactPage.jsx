"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { PixelShell, Panel, PixelButton, copyText } from "./ui";
import { identity } from "@/data/portfolio";

// Next.js only exposes NEXT_PUBLIC_*-prefixed vars to the browser.
const SID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PK = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const CONFIGURED = !!(SID && TID && PK);

function mailtoFor({ name, email, subject, message }) {
  const body = `From: ${name} <${email}>%0D%0A%0D%0A${encodeURIComponent(message)}`;
  return `mailto:${identity.email}?subject=${encodeURIComponent(subject || "Hello from your portfolio")}&body=${body}`;
}

const inputCls =
  "w-full px-3 py-2.5 text-[14px] text-[#2a2230] placeholder-[#9a8d6f] outline-none transition-colors focus:border-[#bb8f30]";
const inputStyle = { background: "#fbf3df", border: "2px solid #6b5535" };

function Note({ label, value, href }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-[#cdbfa0] py-2.5 last:border-0">
      <span className="min-w-0">
        <span className="font-pixel block text-[10px] uppercase tracking-wider text-[#9a743f]">{label}</span>
        <a href={href} className="block truncate text-[14px] text-[#3a2f22] hover:underline">{value}</a>
      </span>
      <button
        type="button"
        onClick={() => copyText(value).then((ok) => { if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1400); } })}
        className="font-pixel shrink-0 px-2 py-1 text-[10px] text-[#1a1420]"
        style={{ background: "#D4A848", border: "2px solid #2a2230" }}
      >
        {copied ? "COPIED!" : "COPY"}
      </button>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!CONFIGURED) { window.location.href = mailtoFor(form); return; }
    setStatus("loading");
    try {
      await emailjs.send(SID, TID, {
        from_name: form.name, reply_to: form.email, subject: form.subject, message: form.message,
      }, PK);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      // graceful fallback — open the user's mail client with the message pre-filled
      window.location.href = mailtoFor(form);
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  const busy = status === "loading" || status === "success";

  return (
    <PixelShell accent="gold" eyebrow="The Inn · Guestbook" title="Leave a letter" subtitle="Open to roles, freelance, or just a chat about design and shipping. Tap any line to copy, or send a note — it lands in my inbox.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* letter / form */}
        <div className="lg:col-span-3">
          <Panel title="SEND A NOTE" accent="gold">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="font-pixel mb-1.5 block text-[10px] uppercase tracking-wider text-[#9a743f]">Name *</span>
                  <input name="name" value={form.name} onChange={onChange} required placeholder="Your name" className={inputCls} style={inputStyle} />
                </label>
                <label className="block">
                  <span className="font-pixel mb-1.5 block text-[10px] uppercase tracking-wider text-[#9a743f]">Email *</span>
                  <input type="email" name="email" value={form.email} onChange={onChange} required placeholder="you@example.com" className={inputCls} style={inputStyle} />
                </label>
              </div>
              <label className="block">
                <span className="font-pixel mb-1.5 block text-[10px] uppercase tracking-wider text-[#9a743f]">Subject</span>
                <input name="subject" value={form.subject} onChange={onChange} placeholder="What's this about?" className={inputCls} style={inputStyle} />
              </label>
              <label className="block">
                <span className="font-pixel mb-1.5 block text-[10px] uppercase tracking-wider text-[#9a743f]">Message *</span>
                <textarea name="message" value={form.message} onChange={onChange} required rows={5} placeholder="Tell me about the role, project, or idea…" className={`${inputCls} resize-none`} style={inputStyle} />
              </label>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <PixelButton as="button" onClick={() => {}} accent="gold">
                  {status === "loading" ? "Sending…" : status === "success" ? "Sent! ✓" : "Send note →"}
                </PixelButton>
                <a href={mailtoFor(form)} className="text-[13px] text-[#6b5535] underline hover:text-[#3a2f22]">or email me directly</a>
              </div>
              {status === "success" && <p className="text-[13px] font-medium text-[#3f8a3f]">Thanks — your letter is on its way. I'll reply soon.</p>}
              {status === "error" && <p className="text-[13px] font-medium text-[#b15545]">Couldn't send automatically — I've opened your mail app instead.</p>}
            </form>
          </Panel>
        </div>

        {/* pinned notes */}
        <div className="space-y-6 lg:col-span-2">
          <Panel title="PINNED NOTES" accent="rose">
            <Note label="Email" value={identity.email} href={`mailto:${identity.email}`} />
            <Note label="Phone" value={identity.phone} href={`tel:${identity.phone.replace(/[^+\d]/g, "")}`} />
            <Note label="GitHub" value={identity.github} href={identity.githubUrl} />
            <Note label="Portfolio" value="you're already here" href="/" />
          </Panel>
          <Panel title="AVAILABILITY" accent="cyan">
            <p className="text-[13px] leading-relaxed text-[#3a2f22]">{identity.statusLong}</p>
            <p className="mt-2 text-[12px] text-[#6b5535]">Remote · Pan-India · Gujarat · open to relocating.</p>
          </Panel>
          <div className="flex flex-wrap gap-3">
            <PixelButton href="/about" accent="gold">Character sheet →</PixelButton>
            <PixelButton href="/" accent="wood">← Map</PixelButton>
          </div>
        </div>
      </div>
    </PixelShell>
  );
}
