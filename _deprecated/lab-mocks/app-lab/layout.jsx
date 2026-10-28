import { Manrope } from "next/font/google";

// Private design lab — option mocks for the studio redesign. Not indexed.
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata = { robots: { index: false, follow: false } };

export default function LabLayout({ children }) {
  return <div className={`${manrope.variable} font-manrope antialiased`}>{children}</div>;
}
