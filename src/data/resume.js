// ============================================================
// Résumé content — verbatim from Krishna's ATS resume PDF.
// Powers the /resume "old-paper" view. Keep in sync with the PDF.
// ============================================================
export const resume = {
  name: "Krishna Mehta",
  title: "UI Engineer · Designer",
  pdf: "/Krishna-Mehta-Resume.pdf", // drop the PDF in /public with this name
  contacts: [
    { label: "+91-9016116357", href: "tel:+919016116357" },
    { label: "krishna200428@gmail.com", href: "mailto:krishna200428@gmail.com" },
    { label: "kpf-flame.vercel.app", href: "https://kpf-flame.vercel.app" },
    { label: "github.com/PRoBoT2004", href: "https://github.com/PRoBoT2004" },
    { label: "Bharuch, Gujarat, India", href: null },
  ],
  summary:
    "UI Engineer with 2 years of experience owning the full design-to-code pipeline. Started as a web design intern building production products, then grew into leading UI/UX design at a remote digital agency. Equal depth on both sides: UX research, design systems, and Figma on the design side; React hooks, Firebase architecture, multi-tenant SaaS, and Lighthouse 90+ performance on the engineering side. Three live B2B products built from scratch — a production ERP/POS with 300+ paying customers, a multi-tenant prepaid POS, and a complete B2B wholesale platform. The person who removes the handoff gap entirely.",
  skills: [
    { group: "UI Engineering", items: "React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, CSS Modules, Flexbox, CSS Grid, Responsive Design, Mobile-First" },
    { group: "React", items: "Hooks, Context API, Custom Hooks, React Router v6, React.lazy + Suspense, Code Splitting, useMemo, useCallback, useReducer" },
    { group: "Animation", items: "GSAP (ScrollTrigger, Timeline), Framer Motion, CSS Animations" },
    { group: "UX Design", items: "User Research, Journey Mapping, Information Architecture, Wireframing, Usability Testing, Competitive Analysis" },
    { group: "UI Design", items: "Figma (Expert), Design Tokens, Component Libraries, Style Guides, Developer Handoff Documentation" },
    { group: "Backend & Cloud", items: "Firebase (Auth, Firestore, Cloud Functions, Security Rules), REST APIs, WhatsApp Business API, Vercel CI/CD" },
    { group: "Performance", items: "React.memo, Lazy Loading, Bundle Optimization, Lighthouse 90+ scores, Core Web Vitals" },
    { group: "Tools", items: "Git, GitHub, Vite, Chrome DevTools, React DevTools, ESLint, Adobe Photoshop, Adobe Illustrator" },
  ],
  experience: [
    {
      role: "UI/UX Designer", org: "UMM Digital (Remote Agency)", loc: "Remote", dates: "Jun 2025 – Present",
      points: [
        "Lead UI/UX design across 4+ concurrent client projects — owning the full lifecycle from brief and UX research through information architecture, wireframes, high-fidelity Figma, and developer handoff documentation.",
        "Designed Enda (global footwear brand) end-to-end — UX research, IA, wireframes, complete Figma design system with 30+ components, and developer handoff specs. Sole contributor. Live at enda-website.vercel.app.",
        "Reduced design iteration cycles by ~30% through structured component libraries and design tokens — handoff documentation eliminates developer questions on every project.",
      ],
    },
    {
      role: "UI/UX Design Intern", org: "UMM Digital (Remote Agency)", loc: "Remote", dates: "Dec 2024 – Jun 2025",
      points: [
        "Designed full UI systems for 3 client products (XTR, Shounya, GOG Games) — Figma to developer-ready handoff documentation, aligning visual identity with each brand's goals.",
        "Conducted qualitative UX research and built Figma prototypes used in usability testing. Promoted to full Designer after 6 months.",
      ],
    },
    {
      role: "Web Developer & Designer Intern", org: "PrimeDigitals", loc: "Remote", dates: "Jul 2024 – Dec 2024",
      points: [
        "Designed and built Shop-ERP — a production POS/ERP (React + Firebase) that went live and now serves 300+ paying customers. Owned every design decision and every component.",
        "Designed the full UX system for Touchpe (5 user roles, prepaid tap-to-pay POS) and Vitran (5-role B2B wholesale distribution platform) — both now production-ready.",
        "Built multi-tenant React architecture with Firestore security rules, Cloud Functions for automated billing, WhatsApp API integration, and 90+ Lighthouse performance scores.",
      ],
    },
  ],
  projects: [
    {
      id: "touchpe", name: "Touchpe", tag: "Prepaid Tap-to-Pay POS",
      tech: "React, Firebase, Figma, Tailwind CSS",
      links: [{ label: "Live", href: "https://touchpe-dev.vercel.app", ext: true }],
      points: [
        "Designed the full UX (cashier flow under 3 seconds for non-tech users), then engineered the multi-tenant React app: tap-to-charge keypad, RFID card flows, WhatsApp receipts, daily settlement CSV/PDF, bonus engine, staff accounts, Today's Summary analytics, custom per-tenant theming.",
        "3-layer Firestore tenant isolation — database rules, app-level tenantId checks, and Cloud Function validation all enforced simultaneously.",
      ],
    },
    {
      id: "vitran", name: "Vitran", tag: "B2B Wholesale Distribution Platform",
      tech: "React, Firebase, Figma, Tailwind CSS",
      links: [{ label: "Live", href: "https://vitran-dev.vercel.app/login", ext: true }],
      points: [
        "Designed 5 role-based interfaces (wholesaler, field agent, retailer, admin, open network) and engineered all 15 modules: GST invoicing (SHA-256 tamper-proof), GSTR-1/3B reports, Tally XML export, Web Bluetooth + ESC/POS driverless printing, field agent app, retailer portal.",
      ],
    },
    {
      id: "shop-erp", name: "Shop-ERP", tag: "Retail POS/ERP",
      tech: "React, Firebase, Figma, WhatsApp API",
      links: [{ label: "Live · 300+ Users", href: "https://shop-erp.primedigitals.io", ext: true }],
      points: [
        "Designed and built end-to-end: RFID auth, real-time Firestore tracking, Cloud Functions for automated invoicing and PDF generation, WhatsApp delivery. 300+ paying customers, zero critical downtime, 10+ months.",
      ],
    },
    {
      id: "enda", name: "Enda", tag: "Global Footwear Brand Website",
      tech: "Figma, React, UX Research, Tailwind CSS, GSAP",
      links: [{ label: "Live", href: "https://enda-website.vercel.app", ext: true }],
      points: [
        "UX research, site map, wireframes, Figma design system, and React production build with GSAP scroll animations. Sole contributor from research to deployment.",
      ],
    },
    {
      id: "meditrack", name: "MediTrack", tag: "Healthcare SaaS",
      tech: "Figma, UX Research, Design Systems",
      links: [{ label: "Portfolio", href: "/quest/meditrack", ext: false }],
      points: [
        "5 user interviews → problem definition → 10-screen SaaS design (desktop + mobile) with complete design system and developer handoff documentation.",
      ],
    },
  ],
  education: {
    school: "Parul University", loc: "Vadodara, Gujarat, India",
    degree: "B.Tech — Computer Science & Engineering", detail: "CGPA: 7.9/10", dates: "Jun 2021 – Jun 2025",
  },
};
