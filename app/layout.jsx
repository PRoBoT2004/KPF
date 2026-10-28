import "./globals.css";
import {
  Instrument_Serif,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Pixelify_Sans,
} from "next/font/google";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const pixel = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixel",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${pixel.variable}`}
    >
      <body className="bg-base font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
