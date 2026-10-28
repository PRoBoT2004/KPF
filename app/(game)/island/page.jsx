import { Inter_Tight } from "next/font/google";
import Island from "@/components/island/Island";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-studio", display: "swap" });

export const metadata = {
  title: "The Island",
  description: "Explore Krishna Mehta's portfolio as a small 3D island: step inside the Quest Hall, the Builder's Forge, the Designer's Studio and the Inn, find seven hidden stars and meet the villagers. Prefer a résumé? The studio site is one click away.",
};

export const viewport = { themeColor: "#cfe8fb" };

export default function Page() {
  return (
    <div className={sans.variable}>
      <Island />
    </div>
  );
}
