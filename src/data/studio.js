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
    { id: "enda", kind: "Client, UMM Digital", line: "Brand site and design system for a global footwear label." },
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
  hero: {
    status: "Open to product roles · remote or relocation",
    role: "Product designer & engineer · Bharuch, India",
    kicker: "Hi, I’m Krishna. I co-own PrimeDigitals and lead UI/UX at UMM Digital.",
    note: "300+ shops close their month on software I built",
    intro: "I co-own PrimeDigitals, where we build the software shops and traders run on, and I lead UI/UX at UMM Digital. I take a product from the first talk with the owner to the code in production.",
    // every number here is on the case-study pages
    facts: [
      { big: "300+", small: "paying merchants on Shop-ERP" },
      { big: "5", small: "products designed and built" },
      { big: "10+ months", small: "live with zero critical downtime" },
      { big: "Figma → Postgres", small: "design, front end and back end" },
    ],
  },
  proof: {
    label: "shops close their month on Shop-ERP",
    line: "Month-end billing for kirana stores and dairies: RFID check-in, invoices that land on WhatsApp the same day.",
    facts: ["10+ months live", "Zero critical downtime", "Designed and coded by me"],
  },
  // the highlights, in the order Krishna chose: Shop-ERP, Trade CRM, Hazeberg, ScanDine (mobile)
  cards: [
    {
      id: "shop-erp", kind: "Product · PrimeDigitals",
      line: "Month-end billing for kirana stores and dairies. RFID check-in, and invoices that land on WhatsApp the same day.",
      facts: ["300+ paying merchants", "10+ months live", "Zero critical downtime"],
      stat: { big: "<30 min", small: "month-end billing, down from 4–6 h" },
    },
    {
      id: "trade-crm", kind: "Product · PrimeDigitals", flat: true,
      line: "A CRM for chemical traders. Every deal on one seven-step track, sorted by who owes the next move.",
      facts: ["Phase 1 live", "15-table multi-tenant schema", "Server-enforced roles"],
      stat: { big: "7 steps", small: "one track for every deal" },
      phone: "/assets/work/trade-crm/phone-board.webp",
    },
    {
      id: "hazeberg", kind: "Client · UMM Digital",
      line: "An animation-first website for a Workday consultancy, with a CMS they edit without code.",
      facts: ["13 pages", "WebGL hero", "Sanity CMS"],
      stat: { big: "13 pages", small: "edited by the client in Sanity" },
      phone: "/assets/work/hazeberg/mobile.webp",
    },
    {
      id: "scandine", kind: "Mobile web app · PrimeDigitals",
      line: "QR dine-in ordering for cafés. Guests scan the table and order from their phone, the kitchen sees it live, and the bill closes itself.",
      facts: ["No app to install", "Live kitchen display", "GST bill, SGST + CGST"],
      stat: { big: "Zero", small: "hardware: a QR sticker is the setup" },
      // shown as three phones instead of one screenshot
      phones: ["/assets/work/scandine/menu.webp", "/assets/work/scandine/status.webp", "/assets/work/scandine/customise.webp"],
    },
  ],
  more: ["touchpe", "vitran", "enda", "primedigitals", "patel-enterprise", "launchpad", "meditrack", "fabric-tryon", "cryptodash"],
  about:
    "I’m Krishna, 22, from Bharuch. I’ve been building software for real shops since 2024. I co-own PrimeDigitals, where we make the tools shops and traders run on, and I lead UI/UX at UMM Digital. I like both sides of a product: sitting with the shop owner, drawing the screens, then writing the code.",
  island: {
    kicker: "There’s another way in.",
    body: "A small 3D island where the work hangs on the walls. Walk in, read a project, find the hidden stars.",
  },
};
