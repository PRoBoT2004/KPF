import { Suspense } from "react";
import Hero from "@/components/studio/Hero";
import { VelocityMarquee, Manifesto, Stats } from "@/components/studio/Intro";
import { FeaturedWork, WorkIndex } from "@/components/studio/Work";
import DesignCode from "@/components/studio/DesignCode";
import Process from "@/components/studio/Process";
import About from "@/components/studio/About";
import { WorldPortal, Contact } from "@/components/studio/Outro";
import { identity } from "@/data/portfolio";

export const metadata = {
  title: { absolute: "Krishna Mehta — Designer & Engineer" },
  description:
    "Designer and engineer, one person, no handoff. Shop-ERP (300+ paying merchants), Touchpe, Vitran, Trade CRM, Hazeberg and Enda — research, interface, code and launch.",
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

// Each below-the-fold section sits in its own Suspense boundary so React can
// hydrate them as separate, interruptible units (keeps the main thread free
// for the hero on slow phones).
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <Hero />
      <Suspense><Manifesto /></Suspense>
      <Suspense><Stats /></Suspense>
      <Suspense><FeaturedWork /></Suspense>
      <Suspense><WorkIndex /></Suspense>
      <Suspense>
        <div data-nav="light" className="border-y border-[var(--line-2)] py-[clamp(1rem,2vw,1.75rem)]">
          <VelocityMarquee />
        </div>
      </Suspense>
      <Suspense><DesignCode /></Suspense>
      <Suspense><Process /></Suspense>
      <Suspense><About /></Suspense>
      <Suspense><WorldPortal /></Suspense>
      <Suspense><Contact /></Suspense>
    </>
  );
}
