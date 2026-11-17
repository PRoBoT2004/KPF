import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
export const metadata = {
  metadataBase: new URL("https://kpf-flame.vercel.app"),
  title: {
    default: "Krishna Mehta — Builder · Designer · Engineer",
    template: "%s — Krishna Mehta",
  },
  description:
    "Designer and engineer — one person, no handoff. Products from the first user interview to production: Shop-ERP (300+ paying merchants), Touchpe, Vitran, Trade CRM, plus client sites like Hazeberg and Enda.",
  icons: { icon: "/assets/logo.png" },
  openGraph: {
    title: "Krishna Mehta — Designer & Engineer",
    description:
      "A clean studio site and an explorable 3D island, one portfolio. 300+ merchants run on software I designed and built.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Krishna Mehta — Designer & Engineer" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0E",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-base font-sans text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
