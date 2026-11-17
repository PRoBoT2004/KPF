import Link from "next/link";
import localFont from "next/font/local";

const mona = localFont({
  src: "../src/fonts/MonaSans.woff2",
  variable: "--font-studio",
  weight: "300 700",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
});

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className={`${mona.variable} studio flex min-h-[100svh] flex-col justify-between px-[clamp(1rem,2.2vw,2rem)] pb-6 pt-8`}>
      <div className="flex items-start justify-between text-[12.5px] uppercase">
        <Link href="/" className="font-medium normal-case">
          <span className="wide block text-[16px] font-[620] tracking-[-0.035em]">Krishna Mehta</span>
        </Link>
        <span className="text-[var(--mute)]">Error 404</span>
      </div>
      <div>
        <h1 className="wide text-[clamp(3rem,11vw,11rem)] font-[560] leading-[0.9] tracking-[-0.055em]">Off the map.</h1>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[36ch] text-[16px] text-[var(--ink-2)]">This page doesn&apos;t exist. The rest of the site does.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-[var(--ink)] px-5 py-3 text-[14px] font-medium text-[var(--paper)]">Back home</Link>
            <Link href="/island" className="rounded-full border border-[var(--ink)] px-5 py-[11px] text-[14px] font-medium">The island</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
