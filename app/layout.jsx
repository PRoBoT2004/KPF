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
    "I take products from problem to deployed and supported. Three live SaaS, 300+ paying customers, all built solo. Design plus engineering, no handoffs.",
  icons: { icon: "/assets/logo.png" },
  openGraph: {
    title: "Krishna Mehta — Builder · Designer · Engineer",
    description:
      "Three live SaaS. 300+ paying customers. All built solo. Choose your class to begin.",
    type: "website",
  },
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
