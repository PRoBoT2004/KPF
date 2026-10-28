import { projects } from "@/data/portfolio";

const BASE = "https://kpf-flame.vercel.app";

export default function sitemap() {
  const now = new Date();
  const pages = [
    { path: "/", priority: 1 },
    { path: "/island", priority: 0.8 },
    { path: "/resume", priority: 0.8 },
    { path: "/world", priority: 0.6 },
    { path: "/quests", priority: 0.5 },
    { path: "/about", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
  ];
  return [
    ...pages.map((p) => ({ url: BASE + p.path, lastModified: now, changeFrequency: "monthly", priority: p.priority })),
    ...projects.map((p) => ({ url: `${BASE}/work/${p.id}`, lastModified: now, changeFrequency: "monthly", priority: p.flagship ? 0.7 : 0.5 })),
  ];
}
