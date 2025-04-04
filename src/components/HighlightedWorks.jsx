import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const caseStudies = [
  {
    id: "colorpencil",
    title: "Color Pencil",
    description: "Revamping an educational platform with modern UI/UX principles.",
    image: "/assets/1.png", // Ensure this is the correct path
    route: "/works/colorpencil-case-study",
    figmaLink: "https://www.figma.com/design/yEkNHJQZbO5gnhIc0QcMSF/Color-Pencil-Pages?node-id=0-1&t=L4Rz2mZt9yiWrNeu-1", // Figma link
  },
  {
    id: "launchpad",
    title: "Launchpad",
    description: "Helping a global school with a modern web presence for better interaction.",
    image: "/assets/2.png",
    route: "/works/launchpad-case-study",
    figmaLink: "https://www.figma.com/design/DsGMoqInLzYyDGChRvXSDa/Launchpad?node-id=0-1&t=6xeU81sgbfEAcuWM-1", // Figma link
  },
  {
    id: "enda",
    title: "Enda",
    description: "Designing a mobile app for a sustainable sportswear brand.",
    image: "/assets/3.png",
    route: "/works/enda-case-study",
    figmaLink: "https://www.figma.com/design/Pv13MUB4JVLSDxbbf5b5hn/Enda?node-id=0-1&t=EohTDFrhTR2BCFXp-1", // Figma link
  },
];

const HighlightedWorks = () => {
  const navigate = useNavigate();

  return (
    <section id="works" className="relative flex flex-col items-center w-screen h-auto py-24 bg-linear-to-t from-black to-slate-950">
      <h2 className="mb-12 text-5xl font-bold text-center text-white">Highlighted Works</h2>

      {/* Looping through case studies */}
      {caseStudies.map((project, index) => (
        <motion.div
          key={project.id}
          className={`flex items-center justify-between w-[85%] mx-auto mb-24 ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          }`} // Alternating layout
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          viewport={{ once: false }}  // Allow animation to trigger each time it comes into view
        >
          {/* Enlarged Mockup Image */}
          <div className="w-[100%] flex justify-center">
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-[2000px] h-auto object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              onClick={() => window.open(project.figmaLink, "_blank")} // Opens the Figma link in a new tab when the image is clicked
            />
          </div>

          {/* Formatted Project Info & Explore Button */}
          <div className="w-[45%] px-12">
            <h3 className="mb-4 text-4xl font-bold text-white">{project.title}</h3>
            <p className="mb-6 text-lg leading-relaxed text-gray-300">
              {project.description}
            </p>
            <button
              onClick={() => navigate(project.route)} // Keeps the internal route navigation as it was
              className="px-8 py-3 text-lg font-semibold text-black transition-all bg-orange-500 rounded-lg hover:bg-orange-600 hover:scale-105"
            >
              Explore Now →
            </button>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default HighlightedWorks;
