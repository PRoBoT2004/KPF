import Link from "next/link";
import { Inter_Tight } from "next/font/google";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-studio", display: "swap" });

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className={`${sans.variable} studio grid-rules flex min-h-[100svh] flex-col justify-between px-[clamp(1rem,2.2vw,2rem)] pb-6 pt-8`}>
      <div className="flex items-start justify-between text-[12.5px] uppercase">
        <Link href="/" className="font-medium normal-case">
          <span className="block text-[15px] font-semibold tracking-[-0.02em]">Krishna Mehta</span>
          <span className="block text-[13px] text-[var(--mute)]">Designer &amp; Engineer</span>
        </Link>
        <span className="text-[var(--mute)]">Error 404</span>
      </div>
      <div>
        <h1 className="text-[clamp(3.4rem,13vw,13rem)] font-medium leading-[0.84] tracking-[-0.068em]">Off the map.</h1>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[36ch] text-[16px] text-[var(--ink-2)]">This page doesn&apos;t exist, but two worlds do.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-[var(--ink)] px-5 py-3 text-[14px] font-medium text-[var(--paper)]">Studio site</Link>
            <Link href="/world" className="rounded-full border border-[var(--ink)] px-5 py-[11px] text-[14px] font-medium">Pixel world</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
