import HeroScene from "@/components/studio/scroll/HeroScene";
import WorkReel from "@/components/studio/scroll/WorkReel";
import MoreWork from "@/components/studio/scroll/MoreWork";
import AboutScene from "@/components/studio/scroll/AboutScene";
import IslandScene from "@/components/studio/scroll/IslandScene";
import ContactScene from "@/components/studio/scroll/ContactScene";
import ScrollProgress from "@/components/studio/scroll/ScrollProgress";
import { identity } from "@/data/portfolio";

export const metadata = {
  title: { absolute: "Krishna Mehta — Designer & Engineer" },
  description:
    "I design software, and then I build it. Shop-ERP (300+ paying merchants), Trade CRM, Hazeberg, ScanDine, Touchpe, Vitran and Enda, from the first interview to production.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Krishna Mehta — Designer & Engineer",
    description: "One person, both sides of the product. 300+ merchants run on software I designed and built.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Krishna Mehta — Designer & Engineer" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: "Product Designer & Engineer",
  email: `mailto:${identity.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Bharuch", addressRegion: "Gujarat", addressCountry: "IN" },
  sameAs: [identity.githubUrl],
};

// A scroll story in five scenes: who I am and the 300 shops, the work
// (stacking cards + the rest), about, the island door, and contact.
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <ScrollProgress />
      <HeroScene />
      <WorkReel /><MoreWork />
      <AboutScene />
      <IslandScene />
      <ContactScene />
    </>
  );
}
