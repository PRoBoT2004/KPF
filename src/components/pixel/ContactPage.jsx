"use client";
import { useState } from "react";
import { motion } from "framer-motion";
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
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [sentName, setSentName] = useState("");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const loading = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setStatus("loading");
    if (!CONFIGURED) { window.location.href = mailtoFor(form); setStatus("idle"); return; }
    try {
      await emailjs.send(SID, TID, {
        from_name: form.name, reply_to: form.email, subject: form.subject, message: form.message,
      }, PK);
      setSentName(form.name.trim().split(" ")[0] || "");
      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus("success");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <PixelShell accent="gold" eyebrow="The Inn · Guestbook" title="Leave a letter" subtitle="Open to roles, freelance, or just a chat about design and shipping. Tap any line to copy, or send a note — it lands in my inbox.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* letter / form */}
        <div className="lg:col-span-3">
          <Panel title="SEND A NOTE" accent="gold">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col items-center gap-3 py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -18 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 13 }}
                  className="grid h-16 w-16 place-items-center text-[30px] font-bold text-[#1a1420]"
                  style={{ background: "#6FCF7A", border: "4px solid #2a2230", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}
                >✓</motion.div>
                <p className="font-serif text-[26px] leading-none text-[#1a1420]">Message sent!</p>
                <p className="max-w-sm text-[13px] leading-relaxed text-[#3a2f22]">
                  Thanks{sentName ? `, ${sentName}` : ""} — your letter just landed in my inbox. I&apos;ll get back to you within a day or two.
                </p>
                <div className="pt-1">
                  <PixelButton as="button" type="button" onClick={() => setStatus("idle")} accent="gold">Send another →</PixelButton>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-pixel mb-1.5 block text-[10px] uppercase tracking-wider text-[#9a743f]">Name *</span>
                    <input name="name" value={form.name} onChange={onChange} required disabled={loading} placeholder="Your name" className={inputCls} style={inputStyle} />
                  </label>
                  <label className="block">
                    <span className="font-pixel mb-1.5 block text-[10px] uppercase tracking-wider text-[#9a743f]">Email *</span>
                    <input type="email" name="email" value={form.email} onChange={onChange} required disabled={loading} placeholder="you@example.com" className={inputCls} style={inputStyle} />
                  </label>
                </div>
                <label className="block">
                  <span className="font-pixel mb-1.5 block text-[10px] uppercase tracking-wider text-[#9a743f]">Subject</span>
                  <input name="subject" value={form.subject} onChange={onChange} disabled={loading} placeholder="What's this about?" className={inputCls} style={inputStyle} />
                </label>
                <label className="block">
                  <span className="font-pixel mb-1.5 block text-[10px] uppercase tracking-wider text-[#9a743f]">Message *</span>
                  <textarea name="message" value={form.message} onChange={onChange} required disabled={loading} rows={5} placeholder="Tell me about the role, project, or idea…" className={`${inputCls} resize-none`} style={inputStyle} />
                </label>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <PixelButton as="button" type="submit" disabled={loading} accent="gold">
                    {loading ? "Sending…" : "Send note →"}
                  </PixelButton>
                  <a href={mailtoFor(form)} className="text-[13px] text-[#6b5535] underline hover:text-[#3a2f22]">or email me directly</a>
                </div>
                {status === "error" && (
                  <p className="text-[13px] font-medium text-[#b15545]">
                    Hmm — that didn&apos;t send. Try again, or{" "}
                    <a href={mailtoFor(form)} className="underline hover:text-[#7a3a30]">email me directly →</a>
                  </p>
                )}
              </form>
            )}
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
