import { Inter_Tight } from "next/font/google";
import ResumePage from "@/components/resume/ResumePage";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-studio", display: "swap" });

export const metadata = {
  title: "Résumé",
  description:
    "Krishna Mehta — Product Designer & Engineer, co-owner of PrimeDigitals. Full résumé: experience, products, skills and education, with a downloadable PDF.",
};

export const viewport = { themeColor: "#F2F2F2" };

export default function Page() {
  return (
    <div className={sans.variable}>
      <ResumePage />
    </div>
  );
}
