import { motion } from "framer-motion";

// Skill Data
const skills = [
  { name: "UI/UX Design", level: "Expert", percentage: 95, color: "orange", shadow: "shadow-orange-500" },
  { name: "Graphic Design", level: "Advanced", percentage: 85, color: "blue", shadow: "shadow-blue-500" },
  { name: "Prototyping", level: "Intermediate", percentage: 80, color: "green", shadow: "shadow-green-500" },
  { name: "Frontend Development", level: "Intermediate", percentage: 75, color: "purple", shadow: "shadow-purple-500" },
  { name: "Video Editing", level: "Beginner", percentage: 20, color: "red", shadow: "shadow-red-500" }
];

// Tools Data
const tools = [
  { name: "Figma", icon: "/assets/figma.png", glow: "shadow-orange-500" },
  { name: "Photoshop", icon: "/assets/photoshop.png", glow: "shadow-blue-500" },
  { name: "Illustrator", icon: "/assets/illustrator.png", glow: "shadow-yellow-500" },
  { name: "After Effects", icon: "/assets/aftereffects.png", glow: "shadow-purple-500" }
];

const SkillsTools = () => {
  return (
    <section id="skills" className="relative flex flex-col items-center w-screen h-auto py-24 bg-linear-to-t from-salte-950 to-black">
      
      {/* Video Background with Fade Effect */}
      <video 
        autoPlay 
        loop 
        muted 
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/assets/skills-video.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay for corner fade effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-black via-transparent to-transparent opacity-70 z-[-1]"></div>

      <h2 className="mb-12 text-5xl font-bold tracking-wide text-center text-white">Skills & Tools</h2>

      {/* Skills Section */}
      <motion.div 
        className="w-[80%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        {skills.map((skill, index) => (
          <motion.div 
            key={index}
            className={`relative w-full h-[200px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-xl flex items-center justify-center text-center cursor-pointer transition-all hover:scale-105 hover:shadow-2xl ${skill.shadow}`}
            whileHover={{ scale: 1.08, rotateX: 5, rotateY: 5 }}
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-6">
              <h3 className="text-2xl font-semibold text-white">{skill.name}</h3>
              <div className="relative w-[85%] mt-4 h-5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="absolute top-0 left-0 h-full rounded-full shadow-lg"
                  style={{ backgroundColor: skill.color }}
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${skill.percentage}%`, transition: { duration: 1.5, ease: "easeInOut" } }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-400">{skill.level}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tools Section */}
      <div className="flex flex-col items-center mt-20">
        <h3 className="mb-8 text-4xl font-semibold text-white">Tools I Use</h3>

        <div className="grid grid-cols-2 gap-12 sm:grid-cols-4">
          {tools.map((tool, index) => (
            <motion.div 
              key={index}
              className={`relative flex flex-col items-center text-center bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 transition-all transform hover:scale-110 hover:shadow-2xl hover:-translate-y-3 ${tool.glow}`}
            >
              <img src={tool.icon} alt={tool.name} className="w-24 h-24 transition-all duration-300 hover:scale-110" />
              <p className="mt-4 text-xl font-semibold text-white">{tool.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsTools;
