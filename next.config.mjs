/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // The old flat portfolio is replaced by the Studio world at "/".
      { source: "/traditional", destination: "/", permanent: true },
      { source: "/works", destination: "/#work", permanent: true },
      { source: "/works/enda-case-study", destination: "/work/enda", permanent: true },
      { source: "/works/launchpad-case-study", destination: "/work/launchpad", permanent: true },
      { source: "/works/meditrack-case-study", destination: "/work/meditrack", permanent: true },
      { source: "/works/cryptodash-case-study", destination: "/work/cryptodash", permanent: true },
      { source: "/works/:slug", destination: "/#work", permanent: true },
      // The pixel world used to live at "/" — /play is a friendly alias.
      { source: "/play", destination: "/world", permanent: false },
    ];
  },
};

export default nextConfig;
