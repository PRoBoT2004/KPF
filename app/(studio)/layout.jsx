import localFont from "next/font/local";
import { Kalam } from "next/font/google";
import StudioChrome from "@/components/studio/Chrome";

// The Studio world: white paper, black ink, one typeface.
// Mona Sans (GitHub, 2024, SIL OFL — see src/fonts/MonaSans-OFL.txt) is a variable
// grotesk with a width axis: headlines run wide (font-stretch 125%), text runs normal.
// Self-hosted and trimmed to Latin, weight 300–700, width 75–125% (117 KB).
// Kalam is only the pen for the handwritten margin notes.
const mona = localFont({
  src: "../../src/fonts/MonaSans.woff2",
  variable: "--font-studio",
  weight: "300 700",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
});

const hand = Kalam({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hand",
  display: "swap",
});

export const viewport = { themeColor: "#FFFFFF" };

export default function StudioLayout({ children }) {
  return (
    <div className={`${mona.variable} ${hand.variable} studio min-h-[100svh]`}>
      <StudioChrome>{children}</StudioChrome>
    </div>
  );
}
