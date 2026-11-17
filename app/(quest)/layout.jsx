import { legacyFonts } from "@/fonts/legacy";

// Deep pixel pages (/quest, /about, /contact, /resume) own their chrome via PixelShell.
// The wrapper only carries the pixel-world fonts (display: contents, so no box).
export default function QuestLayout({ children }) {
  return <div className={`${legacyFonts} contents font-sans`}>{children}</div>;
}
