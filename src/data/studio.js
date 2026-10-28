// ============================================================
// Copy for the Studio world ("/"). Every claim here traces back
// to portfolio.js / resume.js / the project repos — no invented
// numbers. Project facts stay in portfolio.js; this file holds
// the section copy and the order things appear in.
// ============================================================

export const featuredOrder = ["shop-erp", "hazeberg", "trade-crm", "enda", "touchpe"];

export const hero = {
  first: "Krishna",
  last: "Mehta",
  statement:
    "Designer and engineer — one person, no handoff. I take products from the first user interview to production, and keep them running.",
};

export const marqueeWords = [
  "Product design", "React & Next.js", "Design systems", "UX research",
  "Multi-tenant SaaS", "Figma", "Motion & WebGL", "PostgreSQL", "Firebase",
];

export const manifesto =
  "Most products lose something between the design file and the deploy. I work on both sides of that gap — research, interface, code, data, launch — so nothing gets lost in translation. Today, more than 300 shops run their month-end billing on software I designed and built.";

export const stats = [
  { value: 300, suffix: "+", label: "paying merchants", note: "on Shop-ERP" },
  { value: 10, suffix: "+", label: "months in production", note: "zero critical downtime" },
  { value: 3, prefix: "<", suffix: "s", label: "tap-to-charge", note: "Touchpe cashier flow" },
  { value: 4, label: "B2B products", note: "designed + built end to end" },
];

export const capabilities = {
  design: [
    "UX research & user interviews",
    "Information architecture & flows",
    "Wireframes & prototyping",
    "Figma design systems",
    "Visual & interaction design",
    "Usability testing & handoff docs",
  ],
  engineering: [
    "React, Next.js & TypeScript",
    "Firebase — Auth, Firestore, Functions, Rules",
    "PostgreSQL + Drizzle ORM",
    "Multi-tenant SaaS architecture",
    "WhatsApp & REST API integrations",
    "GSAP, Framer Motion & WebGL",
    "Performance — Lighthouse 90+",
    "Playwright end-to-end testing",
  ],
};

export const process = [
  {
    n: "01", title: "Listen",
    body: "Talk to the people who'll actually use it — before a single screen exists.",
    proof: "MediTrack started with 5 user interviews.", href: "/work/meditrack",
  },
  {
    n: "02", title: "Shape",
    body: "Flows, information architecture and wireframes — decide what the product is about.",
    proof: "Trade CRM is organised around one question: who is this deal waiting on?", href: "/work/trade-crm",
  },
  {
    n: "03", title: "Design",
    body: "A system, not a pile of screens — tokens, components and the details that make it feel right.",
    proof: "Enda's Figma design system: 30+ components, research to handoff.", href: "/work/enda",
  },
  {
    n: "04", title: "Build",
    body: "Production code from the same head that drew it — no handoff, no 'design intent' gap.",
    proof: "Vitran: SHA-256 tamper-proof invoices and driverless Bluetooth printing.", href: "/work/vitran",
  },
  {
    n: "05", title: "Ship & stay",
    body: "Deploy, watch, support. A product isn't done when it launches.",
    proof: "Shop-ERP: 10+ months in production, zero critical downtime.", href: "/work/shop-erp",
  },
];

export const toolsWall = [
  "Figma", "Photoshop", "Illustrator", "After Effects", "React", "Next.js", "TypeScript",
  "Tailwind CSS", "GSAP", "Framer Motion", "WebGL", "Firebase", "PostgreSQL", "Drizzle",
  "Sanity", "WhatsApp API", "Playwright", "Vercel", "Git", "Claude", "GitHub Copilot",
];

export const worldPortal = {
  title: "There's another way in.",
  body: "Prefer to explore? Walk a small 3D island and step inside the Quest Hall, the Builder's Forge, the Designer's Studio and the Engineer's Workshop, where the work hangs on the walls. Same work, played as a game.",
  places: ["Quest Hall", "Builder's Forge", "Designer's Studio", "Engineer's Workshop", "The Inn"],
};

export const contact = {
  lines: ["Let's build", "the whole thing."],
  status: "Open to product-first teams of 10–150 — remote, pan-India, or relocation. Design-focused, engineering-focused or hybrid roles.",
};
