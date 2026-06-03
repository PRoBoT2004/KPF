import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";
import QuestPage from "@/components/pixel/QuestPage";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const p = projects.find((x) => x.id === params.id);
  if (!p) return { title: "Quest" };
  return {
    title: `${p.name} — ${p.subtitle}`,
    description: p.outcome,
    openGraph: { title: `${p.name} — Quest`, description: p.subtitle, type: "article" },
  };
}

export default function Page({ params }) {
  if (!projects.some((p) => p.id === params.id)) notFound();
  return <QuestPage id={params.id} />;
}
