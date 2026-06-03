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

// ---- Projects (Quest Board + Projects page) ----
export const projects = [
  {
    id: "shop-erp",
    name: "Shop-ERP",
    category: "Product", flagship: true, accent: "gold", image: "/assets/projects/shop-erp.png",
    subtitle: "Month-end billing ERP for retail shops",
    blurb: "Month-end billing ERP for retail shops.",
    status: "Live · 300+ paying merchants · 10mo uptime",
    tech: ["React", "Firebase", "Cloud Functions", "WhatsApp API", "Tailwind", "Vercel"],
    live: "https://shop-erp.primedigitals.io",
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
    subtitle: "Prepaid tap-to-pay POS for Indian local retail",
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
    subtitle: "Your city's business network — B2B wholesale distribution",
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

  // ---- Client / agency work (UMM Digital) ----
  {
    id: "enda",
    name: "Enda",
    category: "Client", accent: "rose", image: "/assets/e1.png",
    subtitle: "Global footwear brand — site & design system",
    role: "Solo contributor at UMM Digital — UX research, IA, wireframes, the Figma design system, and the production React build.",
    overview:
      "A brand site for Enda, a global footwear label. I owned it end-to-end: research and information architecture, a full Figma design system, then the production React front-end with GSAP scroll motion.",
    highlights: [
      "UX research → IA → wireframes → hi-fi design system",
      "Production React build with GSAP scroll animation",
      "Owned both the design and the front-end, solo",
    ],
    tech: ["React", "Figma", "Tailwind", "GSAP", "Vercel"],
    live: "https://enda-website.vercel.app",
    caseStudy: "/works/enda-case-study",
  },
  {
    id: "launchpad",
    name: "Launchpad",
    category: "Client", accent: "rose", image: "/assets/lp1.png",
    subtitle: "Modern web presence for a global school",
    role: "UI/UX design at UMM Digital.",
    overview:
      "A modern, welcoming web presence for a global school — clearer information architecture and a warmer interface to improve how prospective families explore and interact with the brand.",
    highlights: [
      "End-to-end UI/UX in Figma",
      "Reworked the information architecture",
      "Design system + interactive prototype",
    ],
    tech: ["Figma", "React", "Tailwind"],
    figma: "https://www.figma.com/design/DsGMoqInLzYyDGChRvXSDa/Launchpad?node-id=0-1",
    caseStudy: "/works/launchpad-case-study",
  },
  {
    id: "colorpencil",
    name: "Color Pencil",
    category: "Client", accent: "rose", image: "/assets/cph.png",
    subtitle: "Brand & interface design",
    role: "Product / interface design at UMM Digital.",
    overview:
      "Interface and brand design work for Color Pencil, a UMM Digital client — a consistent, brand-led component system across the product.",
    highlights: ["Interface design in Figma", "Brand-led component system"],
    tech: ["Figma"],
    caseStudy: "/works/colorpencil-case-study",
  },
  {
    id: "biocon",
    name: "Biocon Biologics",
    category: "Client", accent: "rose", image: "/assets/bc1.png",
    subtitle: "Educational experience in the digital space",
    role: "Design at UMM Digital.",
    overview:
      "A digital educational experience for Biocon Biologics — turning dense material into a clear, navigable interface.",
    highlights: ["Information design for complex content", "Clean, accessible interface"],
    tech: ["Figma", "React"],
    caseStudy: "/works/bioconbiologics-case-study",
  },
  {
    id: "ongo",
    name: "OnGo",
    category: "Client", accent: "rose", image: "/assets/ongo.png",
    subtitle: "Commute app — mobile UX & branding",
    role: "Mobile UX + branding.",
    overview:
      "OnGo simplifies daily commutes with an intuitive mobile experience and sharp branding — clean flows and a confident identity system.",
    highlights: ["Mobile-first UX flows", "Brand identity + UI system"],
    tech: ["Figma"],
    caseStudy: "/works/ongo-case-study",
  },

  // ---- Lab & studies (personal builds, design exercises) ----
  {
    id: "cryptodash",
    name: "CryptoDash",
    category: "Lab", accent: "cyan", image: "/assets/CD_1.png",
    subtitle: "Real-time cryptocurrency dashboard",
    role: "Front-end build.",
    overview:
      "A live cryptocurrency dashboard — real-time market data through a public API in a responsive, component-driven UI.",
    highlights: ["Real-time API integration", "Responsive, component-based front-end", "Live market data + charts"],
    tech: ["React", "REST API", "Tailwind"],
    live: "https://crypto-dash-blush-three.vercel.app/",
    caseStudy: "/works/cryptodash-case-study",
  },
  {
    id: "dripstride",
    name: "DripStride",
    category: "Lab", accent: "cyan", image: "/assets/DS_1.png",
    subtitle: "E-commerce sneaker store",
    role: "Front-end build.",
    overview:
      "An e-commerce sneaker storefront focused on a clean component architecture and a smooth shopping experience.",
    highlights: ["Component-based storefront", "Cart & product flows", "Smooth, responsive UX"],
    tech: ["React", "Tailwind"],
    live: "https://dripstride.vercel.app/",
    caseStudy: "/works/dripstride-case-study",
  },
  {
    id: "meditrack",
    name: "MediTrack",
    category: "Lab", accent: "cyan", image: "/assets/meditrack-dashboard.png",
    subtitle: "Healthcare management SaaS — design study",
    role: "Product design (not shipped — a design exercise).",
    overview:
      "A healthcare management SaaS for Indian families: from 5 user interviews and problem definition to a 10-screen product design (desktop + mobile) with a full design system and developer handoff docs.",
    highlights: ["5 user interviews + problem definition", "10-screen SaaS design (desktop + mobile)", "Full design system + handoff docs"],
    tech: ["Figma"],
    caseStudy: "/works/meditrack-case-study",
  },
  {
    id: "fabric-tryon",
    name: "Fabric Try-On",
    category: "Lab", accent: "cyan", image: null,
    subtitle: "AI virtual clothing try-on",
    role: "Build — live MVP.",
    overview:
      "An AI-powered virtual try-on for fashion e-commerce — letting shoppers preview clothing to reduce returns. Live MVP; pricing model in progress.",
    highlights: ["AI-powered virtual try-on", "Aimed at reducing e-commerce returns", "Live MVP"],
    tech: ["React", "Tailwind", "AI APIs"],
    live: "https://fabric-tryon.vercel.app",
  },
];

// Flagship live products (used for the in-game quick list + character sheet)
export const flagshipProjects = projects.filter((p) => p.flagship);

// Gallery groupings for the Hall of Quests
export const projectCategories = [
  { key: "Product", label: "Products", blurb: "Live SaaS I design, build and ship solo.", accent: "gold" },
  { key: "Client", label: "Client Work", blurb: "Design & front-end for UMM Digital clients.", accent: "rose" },
  { key: "Lab", label: "Lab & Studies", blurb: "Personal builds and design exercises.", accent: "cyan" },
];

// ---- About ----
export const about = {
  intro:
    "I'm a generalist tech builder — I design, code, and ship products end-to-end. I don't just design or just code; I take products from problem to deployed and supported in production.",
  body: [
    "I just completed my B.Tech in Computer Science at Parul University (2025). Currently I lead UI/UX design at UMM Digital (a remote agency), designing for clients like Enda (global footwear), LaunchPad and Color Pencil.",
    "On the side I build my own products under PrimeDigitals — Shop-ERP (300+ paying merchants in active use), Touchpe (prepaid POS in customer acquisition), and Vitran (B2B wholesale distribution).",
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
