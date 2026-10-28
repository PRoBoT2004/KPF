// ============================================================
// Résumé content — single source of truth.
// Powers /resume, the About section's experience list, and the
// downloadable PDF (public/Krishna-Mehta-Resume.pdf is printed
// from /resume, so regenerate it after editing this file).
// Only facts from portfolio.js / the project repos — no invented
// metrics.
// ============================================================
export const resume = {
  name: "Krishna Mehta",
  title: "Product Designer & Engineer",
  pdf: "/Krishna-Mehta-Resume.pdf",
  contacts: [
    { label: "+91 90161 16357", href: "tel:+919016116357" },
    { label: "krishna200428@gmail.com", href: "mailto:krishna200428@gmail.com" },
    { label: "kpf-flame.vercel.app", href: "https://kpf-flame.vercel.app" },
    { label: "github.com/PRoBoT2004", href: "https://github.com/PRoBoT2004" },
    { label: "Bharuch, Gujarat, India", href: null },
  ],
  summary:
    "Product designer and engineer with 2+ years of shipping software end to end, from the first user interview to production support. Co-owner of PrimeDigitals, where I design and build our SaaS for Indian retail and trade, including Shop-ERP (300+ paying merchants), and UI/UX designer for client products at UMM Digital. Equal depth in UX research, design systems and Figma, and in React, Next.js, Firebase, PostgreSQL and multi-tenant architecture.",
  skills: [
    { group: "Design", items: "UX research, journey mapping, information architecture, wireframing, usability testing, Figma (expert), design systems and tokens, prototyping, developer handoff" },
    { group: "Frontend", items: "React, Next.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, Tailwind CSS, GSAP, Framer Motion, WebGL shaders, mobile-first layouts" },
    { group: "Backend & data", items: "Firebase (Auth, Firestore, Cloud Functions, Security Rules), PostgreSQL, Drizzle ORM, Zod, REST APIs, WhatsApp Business API, Sanity CMS" },
    { group: "Quality & tools", items: "Lighthouse 90+, Core Web Vitals, code splitting, Playwright tests, Git, Vercel, Vite, Photoshop, Illustrator, Claude, GitHub Copilot" },
  ],
  experience: [
    {
      role: "Co-owner", org: "PrimeDigitals", loc: "Remote", dates: "Jul 2024 – Present",
      points: [
        "Co-own a product studio that builds SaaS for Indian retail and trade. I lead product design and engineering on every product, from customer interviews to production support.",
        "Designed and built Shop-ERP, a POS/ERP (React + Firebase) used by 300+ paying merchants: 10+ months live with zero critical downtime; month-end billing per shop cut from 4–6 hours to under 30 minutes.",
        "Shipped Touchpe (multi-tenant prepaid tap-to-pay POS), Vitran (5-role B2B wholesale platform) and Trade CRM (deal-pipeline CRM for chemical traders, Phase 1 live).",
        "Own the shared architecture: tenant data isolation (Firestore rules, PostgreSQL company scoping), Cloud Functions billing, WhatsApp Business API delivery and Lighthouse 90+ performance.",
      ],
    },
    {
      role: "UI/UX Designer", org: "UMM Digital (Remote Agency)", loc: "Remote", dates: "Dec 2024 – Present",
      points: [
        "Lead UI/UX across 4+ concurrent client projects, owning the full lifecycle: brief, UX research, information architecture, wireframes, high-fidelity Figma and developer handoff.",
        "Designed and built Hazeberg, a 13-page animation-first site for a Workday consultancy: a design system in code, a WebGL hero, pinned scroll scenes and a Sanity CMS the client edits without code.",
        "Designed Enda (global footwear brand) end to end as sole contributor: UX research, IA, a 30+ component Figma design system and the React production build.",
        "Designed UI systems for XTR, Shounya and GOG Games. Structured component libraries and design tokens cut design iteration cycles by ~30%.",
      ],
    },
  ],
  projects: [
    {
      id: "touchpe", name: "Touchpe", tag: "Prepaid tap-to-pay POS",
      tech: "React, Firebase, Tailwind CSS",
      links: [{ label: "Live", href: "https://touchpe-dev.vercel.app", ext: true }],
      points: [
        "Cashier flow under 3 seconds for non-technical staff; card issue/block/replace, WhatsApp receipts, daily settlement export, bonus engine, staff accounts and per-tenant theming. 3-layer tenant isolation: Firestore rules, app-level checks and Cloud Function validation.",
      ],
    },
    {
      id: "vitran", name: "Vitran", tag: "B2B wholesale distribution",
      tech: "React, Firebase, Tailwind CSS",
      links: [{ label: "Live", href: "https://vitran-dev.vercel.app/login", ext: true }],
      points: [
        "5 role-based apps across 15 modules: GST invoices with SHA-256 tamper-proof hashing, GSTR-1/3B reports, Tally XML export, and driverless thermal printing over Web Bluetooth + ESC/POS.",
      ],
    },
    {
      id: "trade-crm", name: "Trade CRM", tag: "Deal-pipeline CRM",
      tech: "Next.js, TypeScript, PostgreSQL",
      links: [{ label: "Live demo", href: "https://trade-crm-theta.vercel.app", ext: true }],
      points: [
        "One 7-step track per deal from inquiry to invoice, organised around who owes the next step. 15-table multi-tenant schema, server-enforced roles, row-locked transactions and document scanning into drafts.",
      ],
    },
    {
      id: "shop-erp", name: "Shop-ERP", tag: "Retail POS/ERP",
      tech: "React, Firebase, WhatsApp API",
      links: [{ label: "Live · 300+ merchants" }],
      points: [
        "RFID customer check-in, real-time Firestore purchase tracking, and Cloud Functions that generate month-end PDF invoices and deliver them over WhatsApp the same day.",
      ],
    },
  ],
  education: {
    school: "Parul University", loc: "Vadodara, Gujarat, India",
    degree: "B.Tech, Computer Science & Engineering", detail: "CGPA 7.9/10", dates: "Jun 2021 – Jun 2025",
  },
  languages: "English (professional), Hindi (native), Gujarati (native)",
};
