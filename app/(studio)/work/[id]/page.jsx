import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";
import CaseStudy from "@/components/studio/CaseStudy";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const p = projects.find((x) => x.id === params.id);
  if (!p) return { title: "Work" };
  const description = p.outcome || p.overview || p.subtitle;
  return {
    title: `${p.name} — ${p.subtitle}`,
    description,
    alternates: { canonical: `/work/${p.id}` },
    openGraph: {
      title: `${p.name} — Krishna Mehta`,
      description: p.subtitle,
      type: "article",
      images: p.cover ? [{ url: p.cover }] : undefined,
    },
  };
}

export default function Page({ params }) {
  if (!projects.some((p) => p.id === params.id)) notFound();
  return <CaseStudy id={params.id} />;
}
