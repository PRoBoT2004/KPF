import { motion } from "framer-motion";

const socialLinks = [
  { name: "LinkedIn", link: "https://www.linkedin.com/in/krm00", icon: "/assets/linkedin.png" },
  { name: "Instagram", link: "https://instagram.com/krishna_2004_28", icon: "/assets/insta.png" },
  { name: "GitHub", link: "https://github.com/PRoBoT2004", icon: "/assets/github.png" }
];

const ContactMe = () => {
  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center w-full min-h-screen px-6 py-20 overflow-hidden text-white sm:px-10 lg:px-20 bg-gradient-to-t from-black to-slate-950"
    >
      {/* Heading */}
      <motion.h2
        className="mb-10 text-4xl font-bold tracking-wide text-center sm:text-5xl"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        Get in Touch
      </motion.h2>

      {/* Social Links */}
      <motion.div
        className="grid grid-cols-2 gap-6 mt-4 sm:flex"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 } }}
        viewport={{ once: true }}
      >
        {socialLinks.map((social, index) => (
          <motion.a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center text-center transition-all transform hover:scale-110"
            whileHover={{ y: -5 }}
            aria-label={`Link to ${social.name}`}
          >
            <img
              src={social.icon}
              alt={`Link to ${social.name}`}
              className="w-12 h-12 transition-transform sm:w-14 sm:h-14"
            />
            <p className="mt-2 text-sm sm:text-base">{social.name}</p>
          </motion.a>
        ))}
      </motion.div>

      {/* Contact Info */}
      <motion.div
        className="mt-12 text-center max-w-[90%] sm:max-w-md"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1, delay: 1 } }}
        viewport={{ once: true }}
      >
        <p className="text-lg sm:text-xl">
          Email:{" "}
          <a
            href="mailto:krishna200428@gmail.com"
            className="text-orange-500 break-all hover:underline"
          >
            krishna200428@gmail.com
          </a>
        </p>
        <p className="mt-4 text-lg sm:text-xl">
          Phone:{" "}
          <a
            href="tel:+919016116357"
            className="text-orange-500 hover:underline"
          >
            +91 9016116357
          </a>
        </p>
      </motion.div>
    </section>
  );
};

export default ContactMe;
