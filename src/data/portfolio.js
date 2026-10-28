// ============================================================
// SINGLE SOURCE OF TRUTH — all portfolio content lives here.
// Pulled verbatim from the spec CONTENT section. No invented data.
// ============================================================

export const identity = {
  name: "Krishna Mehta",
  age: 22,
  location: "Bharuch, Gujarat, India",
  status: "Open to opportunities",
  statusLong:
    "Actively open to opportunities — Remote, Pan-India, Gujarat, willing to relocate.",
  tagline: "Builder · Designer · Engineer",
  yoe: "2 YOE",
  portfolio: "kpf-flame.vercel.app",
  github: "github.com/PRoBoT2004",
  githubUrl: "https://github.com/PRoBoT2004",
  email: "krishna200428@gmail.com",
  phone: "+91-9016116357",
  languages: "English (Professional), Hindi (Native), Gujarati (Native)",
  education:
    "B.Tech Computer Science, Parul University, Vadodara (2021–2025, CGPA 7.9)",
};

// ---- The three classes (landing cards + character-sheet identity) ----
export const classes = {
  designer: {
    id: "designer",
    name: "The Designer",
    short: "Designer",
    icon: "Palette",
    accent: "coral", // rose
    art: "/assets/class-designer.webp",
    tagline: "Crafts how it feels before how it works.",
    subtitle: "Pure design path",
    recommended: false,
    bio: "I lead design at UMM Digital across multiple client products.",
    bioLong:
      "I lead design across multiple client products at UMM Digital. UX research, design systems, Figma craft.",
    // 3 preview bars on the landing card
    preview: [
      { label: "UX Research", level: "Advanced" },
      { label: "Figma", level: "Expert" },
      { label: "Design Systems", level: "Advanced" },
    ],
  },
  engineer: {
    id: "engineer",
    name: "The Engineer",
    short: "Engineer",
    icon: "Code2",
    accent: "aqua", // cyan
    art: "/assets/class-engineer.webp",
    tagline: "Ships production code from problem to deploy.",
    subtitle: "Pure dev path",
    recommended: false,
    bio: "I build production React systems solo.",
    bioLong:
      "I build and ship production React systems solo. Three live SaaS in market, including one with 300+ paying customers.",
    preview: [
      { label: "React", level: "Expert" },
      { label: "Firebase", level: "Advanced" },
      { label: "Architecture", level: "Advanced" },
    ],
  },
  builder: {
    id: "builder",
    name: "The Builder",
    short: "Builder",
    icon: "Sword",
    accent: "gold",
    art: "/assets/class-builder.webp",
    tagline: "Owns the product end-to-end. Design plus engineering, no handoffs.",
    subtitle: "Recommended — Krishna's true class",
    recommended: true,
    bio: "I take products from idea to deployed to maintained.",
    bioLong:
      "I take products from idea to deployed and supported. Design plus engineering, no handoffs. Three shipped SaaS, 300+ paying customers.",
    preview: [
      { label: "Design + Dev Fluency", level: "Expert" },
      { label: "Shipping Speed", level: "Expert" },
      { label: "Ownership", level: "Expert" },
    ],
  },
};

export const classOrder = ["designer", "engineer", "builder"];

// ---- Fuller stat sets per class (shown as pixel bars in the class dialog) ----
const L = { Expert: 4, Advanced: 3, Intermediate: 2, Beginner: 1 };
export const levelToPips = (lvl) => L[lvl] ?? 1;

export const classStats = {
  designer: [
    { label: "Figma", level: "Expert" },
    { label: "UX Research", level: "Advanced" },
    { label: "Design Systems", level: "Advanced" },
    { label: "Visual Design", level: "Advanced" },
    { label: "Prototyping", level: "Advanced" },
    { label: "Front-end", level: "Advanced" },
  ],
  engineer: [
    { label: "React.js", level: "Expert" },
    { label: "JavaScript", level: "Expert" },
    { label: "Tailwind CSS", level: "Expert" },
    { label: "Firebase", level: "Advanced" },
    { label: "Multi-tenant Arch", level: "Advanced" },
    { label: "UI Sensibility", level: "Advanced" },
  ],
  builder: [
    { label: "Product Thinking", level: "Expert" },
    { label: "React.js", level: "Expert" },
    { label: "Figma / Design Sys", level: "Expert" },
    { label: "End-to-end Shipping", level: "Expert" },
    { label: "Firebase Stack", level: "Advanced" },
    { label: "AI-Assisted Dev", level: "Expert" },
  ],
};

// ---- Projects (Quest Board, Hall of Quests, Studio work index) ----
// discipline: "both" | "design" | "engineering" — drives the Design / Engineering
// filters in the Studio world and the class-building quest lists in the pixel world.
// design[] / engineering[]: what Krishna did on each side (sourced from the résumé,
// the spec, and each project's own repo docs — nothing invented).
export const projects = [
  {
    id: "shop-erp",
    name: "Shop-ERP",
    category: "Product", flagship: true, accent: "gold", image: "/assets/projects/shop-erp.png",
    cover: "/assets/work/covers/shop-erp.webp",
    discipline: "both",
    org: "PrimeDigitals",
    subtitle: "Month-end billing ERP for retail shops",
    stat: { value: "300+", label: "paying merchants" },
    design: [
      "Owned every design decision and every component",
      "A calculator-simple UI for shop owners, not a SaaS dashboard",
      "Owner dashboard: revenue, top customers, outstanding balances",
    ],
    engineering: [
      "RFID customer auth with real-time Firestore purchase tracking",
      "Cloud Functions for month-end billing + PDF invoices",
      "WhatsApp API for zero-touch invoice delivery",
      "Multi-tenant Firestore security rules",
    ],
    blurb: "Month-end billing ERP for retail shops.",
    status: "Live · 300+ paying merchants · 10mo uptime",
    tech: ["React", "Firebase", "Cloud Functions", "WhatsApp API", "Tailwind", "Vercel"],
    problem:
      "Indian retailers — kirana stores, dairies, small grocers — track customer purchases on paper through the month. At month-end the owner manually totals everything, writes bills by hand, and chases payment over the phone. It takes 4–6 hours per shop, errors compound, and chasing payments burns relationships.",
    built: [
      "RFID customer authentication — tap a card on entry, purchases auto-attribute",
      "Real-time purchase tracking with Firestore",
      "Cloud Functions automating end-of-month billing + PDF invoices",
      "WhatsApp API for zero-touch invoice delivery",
      "Customer profiles: lifetime spend, last visit, payment history",
      "Owner dashboard: revenue, top customers, outstanding balances",
    ],
    outcome:
      "300+ paying merchants actively using it. 10+ months in production, zero critical downtime. Month-end billing cut from 4–6 hours to under 30 minutes.",
    reflection:
      "My first end-to-end production product. Taught me how shop owners actually use software (they want it to feel like a calculator, not a SaaS dashboard) and forced me to learn multi-tenant Firestore security rules properly.",
  },
  {
    id: "touchpe",
    name: "Touchpe",
    category: "Product", flagship: true, accent: "gold", image: "/assets/projects/touchpe.png",
    cover: "/assets/work/covers/touchpe.webp",
    discipline: "both",
    org: "PrimeDigitals · Udaya",
    subtitle: "Prepaid tap-to-pay POS for Indian local retail",
    stat: { value: "<3s", label: "tap-to-charge cashier flow" },
    design: [
      "Designed the full UX system — 5 user roles",
      "Cashier flow under 3 seconds for non-technical users, verified with real users",
      "Per-tenant theming: color picker + light / dark mode",
    ],
    engineering: [
      "Multi-tenant SaaS with 3-layer tenant isolation (rules, app checks, Cloud Functions)",
      "Prepaid RFID/NFC card issue, block and replace flows",
      "Recharge with instant WhatsApp receipts + bonus-on-recharge engine",
      "Daily settlement with CSV / PDF export, Super Admin provisioning",
    ],
    blurb: "Prepaid tap-to-pay POS for Indian local retail.",
    status: "Production-ready · acquiring first tenant · parent brand: Udaya",
    tech: ["React", "Firebase", "Cloud Functions", "WhatsApp API", "Tailwind", "Vercel"],
    live: "https://touchpe-dev.vercel.app",
    problem:
      "Indian local retail runs on credit — owners give goods on a monthly tab, then chase payment. That creates default risk, workflow drag, and cash-flow problems. The inverse model — customer pays upfront, taps to spend — fixes all three, but there's no good tooling for it.",
    built: [
      "Multi-tenant SaaS with 3-layer Firestore security rules (full per-shop isolation)",
      "Tap-to-charge keypad POS with a sub-3-second cashier flow",
      "Prepaid RFID/NFC card issuance, block & replace flows",
      "Recharge with instant WhatsApp receipt; configurable bonus-on-recharge engine",
      "Daily settlement with CSV/PDF export; per-cashier activity stamps",
      "Custom per-tenant theming + Super Admin tenant provisioning",
    ],
    outcome:
      "Production-ready, all features shipped. Architecture proven scalable to a multi-tenant SaaS pattern. Currently acquiring the first paid dairy shop in Gujarat.",
    reflection:
      "The hard part wasn't building it — it was making the cashier flow feel faster than counting cash. Sub-3-second tap-to-charge was the unlock. For B2B SaaS targeting non-technical users, UX speed is the moat, not feature count.",
  },
  {
    id: "vitran",
    name: "Vitran",
    category: "Product", flagship: true, accent: "gold", image: "/assets/projects/vitran.png",
    cover: "/assets/work/covers/vitran.webp",
    discipline: "both",
    org: "PrimeDigitals",
    subtitle: "Your city's business network — B2B wholesale distribution",
    stat: { value: "SHA-256", label: "tamper-proof GST invoices" },
    design: [
      "Designed 5 role-based interfaces: wholesaler, field agent, retailer, admin, open network",
      "Mobile-first UI for people who don't trust software",
      "Retailer self-service portal",
    ],
    engineering: [
      "GST invoices with sequential numbering, SHA-256 hashing and UPI QR",
      "Web Bluetooth + ESC/POS driverless thermal printing (3 formats)",
      "GSTR-3B / GSTR-1 auto-computed; Tally XML export",
      "Tenant impersonation for Super Admin with full audit logs",
    ],
    blurb: "B2B wholesale distribution platform.",
    status: "Production-ready · in refinement",
    tech: ["React", "Firebase", "Tailwind (mobile-first)"],
    live: "https://vitran-dev.vercel.app/login",
    problem:
      "Indian wholesalers run on WhatsApp and Tally. Orders arrive as messages, get manually re-entered into Tally for GST, and field agents track everything on paper. It breaks at scale: agents forget orders, ledgers don't match, GSTR-3B reconciliation takes days, and disputes are common.",
    built: [
      "5 roles: Super Admin, Wholesaler Owner/Agent, Retailer Owner, Customer",
      "Product catalog with HSN codes + GST rates; tiered per-retailer pricing & credit limits",
      "GST invoices with sequential numbering + SHA-256 tamper-proof hashing + UPI QR",
      "Web Bluetooth ESC/POS driverless thermal printing (3 formats)",
      "Day Book, Aged Outstandings (FIFO), GSTR-3B / GSTR-1 auto-computed",
      "Tally XML export with auto-detected ledger mapping; full audit logs",
    ],
    outcome:
      "Full platform shipped end-to-end. Replaces the WhatsApp + Tally workflow in a single mobile-first platform. In refinement based on early user feedback.",
    reflection:
      "Building for Indian wholesalers means building for people who don't trust software. The SHA-256 tamper-proof invoice hashing was the moment one wholesaler said he'd actually use it — because nobody could quietly edit an invoice after the fact. Cryptographic integrity created trust faster than any UX polish.",
  },
  {
    id: "trade-crm",
    name: "Trade CRM",
    category: "Product", flagship: true, accent: "gold", image: ["/assets/work/trade-crm/cover.webp"],
    cover: "/assets/work/trade-crm/cover.webp",
    gallery: [
      { src: "/assets/work/trade-crm/board.webp", alt: "Trade CRM pipeline board — every open deal by step" },
      { src: "/assets/work/trade-crm/tour-5.webp", alt: "Trade CRM deal page" },
      { src: "/assets/work/trade-crm/tour-9.webp", alt: "Trade CRM document flow" },
    ],
    phone: [
      { src: "/assets/work/trade-crm/phone-dashboard.webp", alt: "Trade CRM dashboard on a phone, dark mode" },
      { src: "/assets/work/trade-crm/phone-board.webp", alt: "Trade CRM pipeline on a phone, dark mode" },
    ],
    discipline: "both",
    org: "PrimeDigitals",
    year: "2026",
    subtitle: "Deal-pipeline CRM for Indian chemical traders",
    blurb: "Every trade deal on one 7-step track.",
    status: "Phase 1 live · multi-tenant · PrimeDigitals",
    stat: { value: "7-step", label: "deal track, Sales ⇄ Purchase" },
    tech: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Drizzle ORM", "Tailwind v4", "Zod", "Playwright"],
    live: "https://trade-crm-theta.vercel.app",
    problem:
      "Chemical traders buy from suppliers and resell to customers. Every deal is spread across WhatsApp, Excel, Tally and phone calls between two teams — Sales and Purchase — so things get missed, and nobody can see which step a deal is stuck on or who it's waiting on.",
    built: [
      "One 7-step track per deal: Inquiry → Quotation (Rev 0/1/2) → Customer PO → PO to Supplier → Goods Received → Proforma → Sales Invoice + Delivery Challan",
      "Dashboard that answers 'what's pending, and who is it waiting on?' — with ageing badges per deal",
      "Document Scan: reads WhatsApp text, PDFs and photos into drafts (rules reader → local vision model → optional Claude)",
      "Automatic cross-checks: customer PO vs quotation, supplier invoice vs PO",
      "Multi-supplier purchase planner and automatic advance deduction",
      "GST-ready documents (GSTIN autofill, HSN, CGST/SGST/IGST), Ctrl+K search and an audit-ready Deal File PDF",
    ],
    design: [
      "Organised the whole product around one question: what's pending, and who is it waiting on?",
      "Sales / Purchase / Admin role switcher, dark mode and phone-first layouts",
      "A standalone clickable demo with a 14-step guided tour for prospective clients",
    ],
    engineering: [
      "15-table PostgreSQL schema — every table and index scoped by company_id (multi-tenant)",
      "Roles enforced on the server; one transaction per save with row locks (SELECT … FOR UPDATE)",
      "Custom JWT auth (jose + bcrypt), Zod validation, per-company per-financial-year numbering",
      "Attachments fingerprinted with SHA-256; 9 Playwright end-to-end scripts",
    ],
    outcome:
      "Phase 1 — the complete deal pipeline — is live as a multi-tenant product under PrimeDigitals, with a clickable demo and guided tour for prospective clients.",
    decision:
      "Instead of organising the app around records (customers, products, invoices), I organised it around waiting: every deal always shows which team owes the next step, and for how long. That one choice shaped the dashboard, the board and every notification.",
  },

  // ---- Client / agency work (UMM Digital) ----
  {
    id: "hazeberg",
    name: "Hazeberg",
    category: "Client", featured: true, accent: "rose", image: ["/assets/work/hazeberg/cover.webp"],
    cover: "/assets/work/hazeberg/cover.webp",
    gallery: [
      { src: "/assets/work/hazeberg/scroll-2.webp", alt: "Hazeberg — 'Why Hazeberg' section with an animated orb" },
      { src: "/assets/work/hazeberg/scroll-4.webp", alt: "Hazeberg — 'Our impact' pinned scroll scene" },
      { src: "/assets/work/hazeberg/scroll-1.webp", alt: "Hazeberg home page — section transition" },
      { src: "/assets/work/hazeberg/about-top.webp", alt: "Hazeberg about page" },
    ],
    phone: [
      { src: "/assets/work/hazeberg/mobile.webp", alt: "Hazeberg home on a phone" },
      { src: "/assets/work/hazeberg/mobile-2.webp", alt: "Hazeberg on a phone, scrolled" },
    ],
    discipline: "both",
    org: "UMM Digital",
    client: "Hazeberg Consulting LLP",
    year: "2026",
    subtitle: "Animation-first website + CMS for a Workday consultancy",
    stat: { value: "13", label: "pages, CMS-editable" },
    role: "Design + development at UMM Digital — design direction, a design system built in code, and the full Next.js + Sanity build.",
    overview:
      "Hazeberg Consulting LLP is a Workday consultancy whose site was a one-page template. I designed and built its replacement: a 13-page, animation-first marketing site — seven Workday service pages, the Berg app, careers and contact — on a Sanity CMS the team can edit without touching code.",
    highlights: [
      "13 pages · 130 components, designed in code",
      "WebGL shader hero, pinned scroll scenes, a globe and a live-time world map",
      "Sanity CMS with draft mode + on-publish revalidation",
    ],
    design: [
      "Explored three palette directions (Harbor, Signal, Atlas) — landed on 'blue leads, yellow is the call to action'",
      "Design system in code: Manrope + Space Mono, cool neutrals and a signature 'notch' card",
      "Moodboard and a direction showcase for client sign-off",
      "Recovered and cleaned up the brand logo; vectorised client marks",
    ],
    engineering: [
      "Raw WebGL shader hero ('horizon glow')",
      "Pinned scroll scenes, a services wheel, a six-stage service dial, a cobe globe and a dotted world map with live local times",
      "Sanity CMS — editors change words, not structure — with draft mode and a revalidate webhook",
      "Lenis smooth scroll + Motion; a 36-check Playwright header suite",
    ],
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Sanity", "Motion", "Lenis", "WebGL"],
    live: "https://hazeberg.vercel.app",
  },
  {
    id: "enda",
    name: "Enda",
    category: "Client", featured: true, accent: "rose", image: ["/assets/projects/enda.png", "/assets/e1.png"],
    cover: "/assets/work/covers/enda.webp",
    gallery: [
      { src: "/assets/work/enda/2.webp", alt: "Enda — UI screen" },
      { src: "/assets/work/enda/1.webp", alt: "Enda — UI screen" },
      { src: "/assets/work/enda/3.webp", alt: "Enda — UI screen" },
      { src: "/assets/work/enda/4.webp", alt: "Enda — UI screen" },
    ],
    discipline: "both",
    org: "UMM Digital",
    client: "Enda",
    subtitle: "Global footwear brand — site & design system",
    stat: { value: "30+", label: "component Figma design system" },
    role: "Solo contributor at UMM Digital — UX research, IA, wireframes, the Figma design system, and the production React build.",
    overview:
      "A brand site for Enda, a global footwear label. I owned it end-to-end: research and information architecture, a full Figma design system, then the production React front-end with GSAP scroll motion.",
    highlights: [
      "UX research → IA → wireframes → hi-fi design system",
      "Production React build with GSAP scroll animation",
      "Owned both the design and the front-end, solo",
    ],
    design: [
      "UX research, site map and wireframes",
      "Complete Figma design system with 30+ components",
      "Developer handoff specs",
    ],
    engineering: [
      "Production React + Tailwind front-end",
      "GSAP scroll animation",
      "Deployed on Vercel",
    ],
    tech: ["React", "Figma", "Tailwind", "GSAP", "Vercel"],
    live: "https://enda-website.vercel.app",
  },
  {
    id: "launchpad",
    name: "Launchpad",
    category: "Client", accent: "rose", image: ["/assets/projects/launchpad.png", "/assets/lp1.png"],
    cover: "/assets/work/covers/launchpad.webp",
    gallery: [
      { src: "/assets/work/launchpad/1.webp", alt: "Launchpad — UI screen" },
      { src: "/assets/work/launchpad/2.webp", alt: "Launchpad — UI screen" },
      { src: "/assets/work/launchpad/3.webp", alt: "Launchpad — UI screen" },
    ],
    discipline: "design",
    org: "UMM Digital",
    subtitle: "Modern web presence for a global school",
    role: "UI/UX design at UMM Digital.",
    overview:
      "A modern, welcoming web presence for a global school — clearer information architecture and a warmer interface to improve how prospective families explore and interact with the brand.",
    problem: [
      "Complex and confusing user interface",
      "Lack of intuitive navigation for management",
      "Overwhelming screens and feature density",
    ],
    solution: [
      "Simplified UI with intuitive navigation",
      "Clear feature prioritization and reduced clutter",
      "Fresh, modernized brand feel",
    ],
    highlights: [
      "End-to-end UI/UX in Figma",
      "Reworked the information architecture",
      "Design system + interactive prototype",
    ],
    design: [
      "End-to-end UI/UX in Figma",
      "Reworked the information architecture",
      "Design system + interactive prototype",
    ],
    tech: ["Figma", "React", "Tailwind"],
    figma: "https://www.figma.com/design/DsGMoqInLzYyDGChRvXSDa/Launchpad?node-id=0-1",
  },
  {
    id: "patel-enterprise",
    name: "Patel Enterprise",
    category: "Client", accent: "rose", image: ["/assets/projects/patel-enterprise.png"],
    cover: "/assets/work/covers/patel-enterprise.webp",
    discipline: "both",
    subtitle: "Industrial roofing & shed solutions — business site",
    role: "Design + front-end build.",
    overview:
      "The business website for Patel Enterprise — durable, safe industrial roofing and shed systems for factories, warehouses and commercial structures, powered by Tata BlueScope, Kee Safety, Tegola and Saint-Gobain.",
    highlights: ["Brand / business website", "Clear services, products & quote flow", "Responsive, mobile-first build"],
    design: ["Brand / business website design", "Clear services, products & quote flow"],
    engineering: ["Responsive, mobile-first React + Tailwind build"],
    tech: ["React", "Tailwind"],
    live: "https://patelenterprise.co/",
  },
  {
    id: "primedigitals",
    name: "PrimeDigitals",
    category: "Client", accent: "rose", image: ["/assets/projects/primedigitals.png"],
    cover: "/assets/work/covers/primedigitals.webp",
    discipline: "both",
    org: "PrimeDigitals",
    subtitle: "The product studio I co-own — “software shops actually run on”",
    role: "Co-owner — brand, design + build, end-to-end.",
    overview:
      "PrimeDigitals is the product studio I co-own — live SaaS in real shops (point-of-sale, prepaid, dine-in and B2B), and the brand behind Shop-ERP, Touchpe, Vitran and Trade CRM. I designed and built the studio's site end-to-end.",
    highlights: ["Product studio I co-own", "Home of Shop-ERP, Touchpe, Vitran & Trade CRM", "Brand, web & engineering — end to end"],
    design: ["Studio brand and site design"],
    engineering: ["React + Tailwind + Framer Motion build"],
    tech: ["React", "Tailwind", "Framer Motion"],
    live: "https://primedigitals.co.in/",
  },

  // ---- Lab & studies (personal builds, design exercises) ----
  {
    id: "cryptodash",
    name: "CryptoDash",
    category: "Lab", accent: "cyan", image: ["/assets/projects/cryptodash.png", "/assets/CD_1.png"],
    cover: "/assets/work/covers/cryptodash.webp",
    gallery: [
      { src: "/assets/work/cryptodash/1.webp", alt: "CryptoDash — dashboard screen" },
      { src: "/assets/work/cryptodash/2.webp", alt: "CryptoDash — dashboard screen" },
      { src: "/assets/work/cryptodash/3.webp", alt: "CryptoDash — dashboard screen" },
    ],
    discipline: "engineering",
    subtitle: "Real-time cryptocurrency dashboard",
    role: "Front-end build.",
    overview:
      "A live cryptocurrency dashboard — real-time market data through a public API in a responsive, component-driven UI.",
    highlights: ["Real-time API integration", "Responsive, component-based front-end", "Live market data + charts"],
    engineering: ["Real-time API integration", "Responsive, component-based front-end", "Live market data + charts"],
    tech: ["React", "REST API", "Tailwind"],
    live: "https://crypto-dash-blush-three.vercel.app/",
  },
  {
    id: "meditrack",
    name: "MediTrack",
    category: "Lab", featured: true, accent: "cyan", image: ["/assets/projects/meditrack.png", "/assets/meditrack-dashboard.png"],
    cover: "/assets/work/covers/meditrack.webp",
    gallery: [
      { src: "/assets/work/meditrack/medications.webp", alt: "MediTrack — medication tracking", caption: "Medication tracking — a zero-confusion daily checklist. Morning, afternoon, evening and night slots clearly separated with instant adherence feedback." },
      { src: "/assets/work/meditrack/records.webp", alt: "MediTrack — centralized records", caption: "Centralized records — every blood test and past prescription, categorized and quick to find." },
      { src: "/assets/work/meditrack/doctors.webp", alt: "MediTrack — doctor directory", caption: "Doctor directory — a unified rolodex of every specialist. One-click access to call clinics and view history." },
      { src: "/assets/work/meditrack/insights.webp", alt: "MediTrack — health insights", caption: "Health insights — blood pressure, blood sugar and heart rate over time, to spot anomalies before they become emergencies." },
    ],
    discipline: "design",
    subtitle: "Healthcare management SaaS — design study",
    stat: { value: "5", label: "user interviews → 10 screens" },
    role: "Product design (not shipped — a design exercise).",
    overview:
      "A healthcare management SaaS for Indian families: from 5 user interviews and problem definition to a 10-screen product design (desktop + mobile) with a full design system and developer handoff docs.",
    challenge:
      "Indian families managing elderly parents' healthcare face three critical challenges: information scattered across WhatsApp and paper files, missed essential medications, and chaos managing multiple doctors. The mental load of asking “Did dad take his BP medicine?” three times a day becomes exhausting for the family health manager.",
    highlights: ["5 user interviews + problem definition", "10-screen SaaS design (desktop + mobile)", "Full design system + handoff docs"],
    design: [
      "5 user interviews + problem definition",
      "10-screen SaaS design (desktop + mobile)",
      "Clarity over decoration — a calm, medical-grade visual language built for trust",
      "Full design system + developer handoff docs",
    ],
    tech: ["Figma"],
  },
  {
    id: "fabric-tryon",
    name: "Fabric Try-On",
    category: "Lab", accent: "cyan", image: ["/assets/projects/fabric-tryon.png"],
    cover: "/assets/work/covers/fabric-tryon.webp",
    discipline: "engineering",
    subtitle: "AI virtual clothing try-on",
    role: "Build — live MVP.",
    overview:
      "An AI-powered virtual try-on for fashion e-commerce — letting shoppers preview clothing to reduce returns. Live MVP; pricing model in progress.",
    highlights: ["AI-powered virtual try-on", "Aimed at reducing e-commerce returns", "Live MVP"],
    engineering: ["AI-powered virtual try-on", "Live MVP on React + Tailwind"],
    tech: ["React", "Tailwind", "AI APIs"],
    live: "https://fabric-tryon.vercel.app",
  },
];

// Flagship live products (used for the in-game quick list + character sheet)
export const flagshipProjects = projects.filter((p) => p.flagship);

// Gallery groupings for the Hall of Quests
export const projectCategories = [
  { key: "Product", label: "Products", blurb: "Live SaaS I design, build and ship solo.", accent: "gold" },
  { key: "Client", label: "Client Work", blurb: "Design & front-end for brands and businesses.", accent: "rose" },
  { key: "Lab", label: "Lab & Studies", blurb: "Personal builds and design exercises.", accent: "cyan" },
];

// ---- About ----
export const about = {
  intro:
    "I'm a generalist tech builder — I design, code, and ship products end-to-end. I don't just design or just code; I take products from problem to deployed and supported in production.",
  body: [
    "I just completed my B.Tech in Computer Science at Parul University (2025). Currently I lead UI/UX design at UMM Digital (a remote agency), designing and building for clients like Enda (global footwear) and Hazeberg (a Workday consultancy).",
    "I also co-own PrimeDigitals, a product studio where I design and build our own products — Shop-ERP (300+ paying merchants in active use), Touchpe (prepaid POS in customer acquisition), and Vitran (B2B wholesale distribution).",
    "My core identity: I ship complete products with real users, not features on a roadmap. I own both design and engineering — no handoff friction, no 'design intent' excuses. From problem to production, it's me.",
  ],
  target:
    "Target: 10–150 person product-first startups. Open to remote, Pan-India, willing to relocate. Design-focused, dev-focused, or hybrid roles.",
};

export const sideQuests = [
  { name: "Enda", blurb: "Global footwear brand site (UMM Digital).", live: "https://enda-website.vercel.app" },
  { name: "Fabric Try-On", blurb: "AI virtual clothing try-on.", live: "https://fabric-tryon.vercel.app" },
  { name: "MediTrack", blurb: "Healthcare SaaS — design only.", live: "/works/meditrack-case-study" },
];

export const achievements = [
  "300+ paying merchants (Shop-ERP)",
  "10+ months uptime, zero critical downtime",
  "Solo end-to-end shipping — 3 production SaaS",
  "Sub-3-second cashier UX (Touchpe)",
  "Cryptographic invoice integrity (Vitran SHA-256)",
  "B.Tech CSE, CGPA 7.9 (Parul University, 2025)",
];

export const tools = [
  "Figma", "Photoshop", "Illustrator", "React", "JavaScript", "Tailwind CSS",
  "GSAP", "Framer Motion", "Firebase", "WhatsApp API", "Vercel", "Git",
  "Claude", "GitHub Copilot",
];
