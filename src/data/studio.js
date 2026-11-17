// ============================================================
// Copy for the Studio world ("/"). Every claim here traces back
// to portfolio.js / resume.js / the project repos — no invented
// numbers. Project facts stay in portfolio.js; this file holds
// the home page copy and the order things appear in.
// (The earlier long home page and its copy live in _deprecated/studio-v1.)
// ============================================================

// ---- Home page (short version, 2026-11) ----
// Plain, first-person copy. Every fact here also lives in portfolio.js / resume.js.
export const home = {
  meta: "Product designer & engineer in Bharuch, India",
  intro:
    "More than 300 shops close their month on Shop-ERP, which I designed and coded. I co-own PrimeDigitals and lead UI/UX at UMM Digital.",
  featured: [
    { id: "shop-erp", kind: "Product", line: "Month-end billing for kirana stores and dairies. RFID check-in, invoices that arrive on WhatsApp." },
    { id: "hazeberg", kind: "Client, UMM Digital", line: "A 13-page, animation-first site for a Workday consultancy, with a CMS they edit themselves." },
    { id: "trade-crm", kind: "Product", line: "Every chemical-trade deal on one seven-step track, sorted by who owes the next move.", flat: true },
    { id: "enda", kind: "Client, UMM Digital", line: "Brand site and Figma design system for a global footwear label, from research to React." },
  ],
  more: [
    { id: "touchpe", kind: "Product", line: "Prepaid tap-to-pay POS. The cashier flow takes under 3 seconds." },
    { id: "vitran", kind: "Product", line: "B2B wholesale platform with tamper-proof GST invoices." },
    { id: "primedigitals", kind: "Studio", line: "The product studio I co-own." },
    { id: "patel-enterprise", kind: "Client", line: "Business site for an industrial roofing company." },
    { id: "launchpad", kind: "Client, UMM Digital", line: "A clearer web presence for a global school." },
    { id: "meditrack", kind: "Design study", line: "Healthcare SaaS, from 5 user interviews to 10 screens." },
    { id: "fabric-tryon", kind: "Experiment", line: "AI virtual try-on for fashion stores." },
    { id: "cryptodash", kind: "Experiment", line: "A live crypto market dashboard." },
  ],
  about: {
    lead: "I’m 22, I live in Bharuch, and I’ve been building software for real shops since 2024.",
    body: "I like being on both sides of a product: sitting with the shop owner, drawing the screens, then writing the code. My favourite moment so far: a wholesaler telling me he’d actually use Vitran, because nobody could quietly edit an invoice after the fact.",
    timeline: [
      { org: "PrimeDigitals", role: "Co-owner", when: "Jul 2024 – now" },
      { org: "UMM Digital", role: "UI/UX Designer", when: "Dec 2024 – now" },
      { org: "Parul University", role: "B.Tech, Computer Science", when: "2021 – 2025" },
    ],
    tools: "Figma, React, Next.js, Firebase, PostgreSQL, Tailwind, GSAP",
    languages: "English, Hindi, Gujarati",
  },
  contact: {
    status: "Open to product teams of 10 to 150 people. Remote, anywhere in India, or I’ll relocate.",
  },
};

// ---- Scroll edition (2026-11) ----
export const scenes = {
  proof: {
    label: "shops close their month on Shop-ERP",
    line: "Month-end billing for kirana stores and dairies: RFID check-in, invoices that land on WhatsApp the same day.",
    facts: ["10+ months live", "Zero critical downtime", "Designed and coded by me"],
  },
  cards: [
    {
      id: "touchpe", kind: "Product · PrimeDigitals",
      line: "Prepaid tap-to-pay POS for local shops. Customers pay upfront, then tap a card to spend.",
      facts: ["Cashier flow under 3 s", "Multi-tenant, 3-layer data isolation", "WhatsApp receipts"],
    },
    {
      id: "trade-crm", kind: "Product · PrimeDigitals", flat: true,
      line: "A CRM for chemical traders. Every deal on one seven-step track, sorted by who owes the next move.",
      facts: ["Phase 1 live", "15-table multi-tenant schema", "Server-enforced roles"],
    },
    {
      id: "hazeberg", kind: "Client · UMM Digital",
      line: "An animation-first website for a Workday consultancy, with a CMS they edit without code.",
      facts: ["13 pages", "WebGL hero", "Sanity CMS"],
    },
    {
      id: "enda", kind: "Client · UMM Digital",
      line: "Brand site and design system for a global footwear label, from research to React.",
      facts: ["Sole contributor", "30+ component Figma system", "React production build"],
    },
  ],
  more: ["vitran", "primedigitals", "patel-enterprise", "launchpad", "meditrack", "fabric-tryon", "cryptodash"],
  about:
    "I’m Krishna, 22, from Bharuch. I’ve been building software for real shops since 2024. I co-own PrimeDigitals, where we make the tools shops and traders run on, and I lead UI/UX at UMM Digital. I like both sides of a product: sitting with the shop owner, drawing the screens, then writing the code.",
  island: {
    kicker: "There’s another way in.",
    body: "A small 3D island where the work hangs on the walls. Walk in, read a project, find the hidden stars.",
  },
};
