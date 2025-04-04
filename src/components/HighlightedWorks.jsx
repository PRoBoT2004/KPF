import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const caseStudies = [
  {
    id: "colorpencil",
    title: "Color Pencil",
    description: "Revamping an educational platform with modern UI/UX principles.",
    image: "/assets/1.png",
    route: "/works/colorpencil-case-study",
    figmaLink: "https://www.figma.com/design/yEkNHJQZbO5gnhIc0QcMSF/Color-Pencil-Pages?node-id=0-1&t=L4Rz2mZt9yiWrNeu-1",
  },
  {
    id: "launchpad",
    title: "Launchpad",
    description: "Helping a global school with a modern web presence for better interaction.",
    image: "/assets/2.png",
    route: "/works/launchpad-case-study",
    figmaLink: "https://www.figma.com/design/DsGMoqInLzYyDGChRvXSDa/Launchpad?node-id=0-1&t=6xeU81sgbfEAcuWM-1",
  },
  {
    id: "enda",
    title: "Enda",
    description: "Designing a mobile app for a sustainable sportswear brand.",
    image: "/assets/3.png",
    route: "/works/enda-case-study",
    figmaLink: "https://www.figma.com/design/Pv13MUB4JVLSDxbbf5b5hn/Enda?node-id=0-1&t=EohTDFrhTR2BCFXp-1",
  },
];

const HighlightedWorks = () => {
  const navigate = useNavigate();

  return (
    <section id="works" className="w-full px-4 py-20 sm:px-8 bg-gradient-to-t from-black to-slate-950">
      <h2 className="mb-16 text-4xl font-bold text-center text-white sm:text-5xl">Highlighted Works</h2>

      {caseStudies.map((project, index) => (
        <motion.div
          key={project.id}
          className={`flex flex-col lg:flex-row items-center justify-between gap-10 mb-24 ${
            index % 2 !== 0 ? "lg:flex-row-reverse" : ""
          }`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          viewport={{ once: true }}
        >
          {/* Image */}
          <div className="flex justify-center w-full lg:w-1/2">
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full max-w-[800px] object-contain rounded-xl shadow-xl cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => window.open(project.figmaLink, "_blank")}
            />
          </div>

          {/* Text Section */}
          <div className="w-full px-4 text-center lg:w-1/2 lg:text-left sm:px-8">
            <h3 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{project.title}</h3>
            <p className="mb-6 leading-relaxed text-gray-300 text-md sm:text-lg">
              {project.description}
            </p>
            <button
              onClick={() => navigate(project.route)}
              className="px-6 py-3 font-semibold text-black transition-all bg-orange-500 rounded-md sm:px-8 text-md sm:text-lg hover:bg-orange-600 hover:scale-105"
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
