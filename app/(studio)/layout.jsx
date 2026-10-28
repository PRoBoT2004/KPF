import { Inter_Tight } from "next/font/google";
import StudioChrome from "@/components/studio/Chrome";

// The Studio world: white-first, one Swiss grotesk (variable 100–900).
const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-studio",
  display: "swap",
});

export const viewport = { themeColor: "#FFFFFF" };

export default function StudioLayout({ children }) {
  return (
    <div className={`${sans.variable} studio min-h-[100svh]`}>
      <StudioChrome>{children}</StudioChrome>
    </div>
  );
}
