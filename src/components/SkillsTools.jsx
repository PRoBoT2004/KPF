import { motion } from "framer-motion";

// Skill Data
const skills = [
  { name: "UI/UX Design", level: "Expert", percentage: 95, color: "orange", shadow: "shadow-orange-500" },
  { name: "Graphic Design", level: "Advanced", percentage: 85, color: "blue", shadow: "shadow-blue-500" },
  { name: "Prototyping", level: "Intermediate", percentage: 80, color: "green", shadow: "shadow-green-500" },
  { name: "Frontend Development", level: "Intermediate", percentage: 75, color: "purple", shadow: "shadow-purple-500" },
  { name: "Video Editing", level: "Beginner", percentage: 20, color: "red", shadow: "shadow-red-500" },
];

// Tools Data - Mixed Frontend & Design
const tools = [
  // Design Tools
  { name: "Figma", icon: "/assets/figma.png", glow: "shadow-orange-500", category: "design" },
  { name: "Photoshop", icon: "/assets/photoshop.png", glow: "shadow-blue-500", category: "design" },
  { name: "Illustrator", icon: "/assets/illustrator.png", glow: "shadow-yellow-500", category: "design" },
  { name: "After Effects", icon: "/assets/aftereffects.png", glow: "shadow-purple-500", category: "design" },
  // Frontend Tools
  { name: "React", icon: "/assets/React.png", glow: "shadow-blue-400", category: "frontend" },
  { name: "JavaScript", icon: "/assets/JS.png", glow: "shadow-yellow-400", category: "frontend" },
  { name: "Vue.js", icon: "/assets/Vue.png", glow: "shadow-green-400", category: "frontend" },
  { name: "HTML", icon: "/assets/HTML.png", glow: "shadow-orange-400", category: "frontend" },
];

const SkillsTools = () => {
  return (
    <section id="skills" className="relative flex flex-col items-center w-full h-auto px-4 py-24 overflow-hidden sm:px-6 lg:px-12 bg-gradient-to-t from-slate-950 to-black">
      
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
      >
        <source src="/assets/skills-video.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-black via-transparent to-transparent opacity-70 z-[-1]"></div>

      <h2 className="mb-16 text-4xl font-bold tracking-wide text-center text-white sm:text-5xl">Skills & Tools</h2>

      {/* Skills Section */}
      <motion.div 
        className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 max-w-7xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        {skills.map((skill, index) => (
          <motion.div 
            key={index}
            className={`relative w-full h-[200px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-xl flex items-center justify-center text-center cursor-pointer transition-all hover:scale-105 hover:shadow-2xl ${skill.shadow}`}
            whileHover={{ scale: 1.08 }}
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-6">
              <h3 className="text-2xl font-semibold text-white">{skill.name}</h3>
              <div className="relative w-full max-w-[85%] mt-4 h-5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
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
      <div className="flex flex-col items-center w-full max-w-6xl mt-24">
        <h3 className="mb-10 text-3xl font-semibold text-center text-white sm:text-4xl">Tools I Use</h3>

        {/* Design Tools */}
        <div className="mb-12">
          <h4 className="mb-6 text-xl font-medium text-center text-orange-400">Design Tools</h4>
          <div className="grid w-full grid-cols-2 gap-8 px-4 sm:grid-cols-4 justify-items-center">
            {tools.filter(tool => tool.category === 'design').map((tool, index) => (
              <motion.div 
                key={index}
                className={`relative flex flex-col items-center text-center bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 transition-all transform hover:scale-110 hover:shadow-2xl hover:-translate-y-3 ${tool.glow}`}
              >
                <img src={tool.icon} alt={tool.name} className="w-16 h-16 transition-transform duration-300 sm:w-20 sm:h-20 hover:scale-110" />
                <p className="mt-3 text-sm font-semibold text-white sm:text-base">{tool.name}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Frontend Tools */}
        <div>
          <h4 className="mb-6 text-xl font-medium text-center text-blue-400">Frontend Tools</h4>
          <div className="grid w-full grid-cols-2 gap-8 px-4 sm:grid-cols-4 justify-items-center">
            {tools.filter(tool => tool.category === 'frontend').map((tool, index) => (
              <motion.div 
                key={index}
                className={`relative flex flex-col items-center text-center bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 transition-all transform hover:scale-110 hover:shadow-2xl hover:-translate-y-3 ${tool.glow}`}
              >
                <img src={tool.icon} alt={tool.name} className="w-16 h-16 transition-transform duration-300 sm:w-20 sm:h-20 hover:scale-110" />
                <p className="mt-3 text-sm font-semibold text-white sm:text-base">{tool.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsTools;