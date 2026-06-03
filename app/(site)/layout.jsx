import Navbar from "@/components/Navbar";

// The "traditional" / recruiter-friendly side of the site keeps the classic navbar.
export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
