// Per-company link for job applications: kpf-flame.vercel.app/for/<company>.
// It shows the same studio home page; Vercel Web Analytics lists /for/<company> visits,
// so Krishna can see which company actually opened the portfolio from an email.
import Home from "../../page";

export const metadata = {
  title: { absolute: "Krishna Mehta — Designer & Engineer" },
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function ForCompany() {
  return <Home />;
}
