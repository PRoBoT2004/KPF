import Link from "next/link";
import localFont from "next/font/local";
import Arcade from "@/components/notfound/Arcade";

const mona = localFont({
  src: "../src/fonts/MonaSans.woff2",
  variable: "--font-studio",
  weight: "300 700",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
});

export const metadata = { title: "Not found" };

// 404: say so plainly, offer the way back, and a couple of games for anyone who wants to stay.
export default function NotFound() {
  return (
    <main className={`${mona.variable} studio flex min-h-[100svh] flex-col px-[clamp(1rem,2.2vw,2rem)] pb-6 pt-6`}>
      <div className="flex items-start justify-between text-[13px]">
        <Link href="/" className="wide block text-[16px] font-[620] tracking-[-0.035em]">Krishna Mehta</Link>
        <span className="text-[var(--mute)]">Error 404</span>
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 py-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <div>
          <p className="tnum text-[14px] text-[var(--mute)]">404</p>
          <h1 className="wide mt-2 text-[clamp(3rem,9vw,8.5rem)] font-[560] leading-[0.9] tracking-[-0.055em]">Off the map.</h1>
          <p className="mt-6 max-w-[38ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-[var(--ink-2)]">
            This page doesn&apos;t exist. The rest of the site does. Or stay a minute and play a round: one game from the café floor, one from my toolbox.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-[var(--ink)] px-5 py-3 text-[14.5px] font-medium text-[var(--paper)]">Back home</Link>
            <Link href="/#work" className="rounded-full border border-[var(--line-2)] px-5 py-3 text-[14.5px] font-medium transition-colors hover:border-[var(--ink)]">See the work</Link>
            <Link href="/island" className="rounded-full border border-[var(--line-2)] px-5 py-3 text-[14.5px] font-medium transition-colors hover:border-[var(--ink)]">The island</Link>
          </div>
        </div>
        <Arcade />
      </div>
    </main>
  );
}
