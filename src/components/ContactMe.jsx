import { motion } from "framer-motion";

const socialLinks = [
  { name: "LinkedIn", link: "www.linkedin.com/in/krm00", icon: "/assets/linkedin.png" },
  // { name: "Mail", link: "mailto:krishna200428@gmail.com?", icon: "/assets/gmail.png" },
  { name: "Instagram", link: "https://instagram.com/krishna_2004_28", icon: "/assets/insta.png" },
  { name: "GitHub", link: "https://github.com/PRoBoT2004", icon: "/assets/github.png" }
];

const ContactMe = () => {
  return (
    <section id="contact" className="relative flex flex-col items-center justify-center w-screen h-screen px-8 py-24 text-white bg-linear-to-t from-black to-slate-950">
      
      <motion.h2 
        className="mb-8 text-5xl font-bold tracking-wide text-center"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        Get in Touch
      </motion.h2>

      {/* Contact Form - Glassmorphism */}
      {/* <motion.div 
        className="w-full max-w-lg p-8 border shadow-lg rounded-xl bg-white/10 backdrop-blur-md border-white/20"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        <form className="flex flex-col gap-4">
          <motion.input 
            type="text" 
            placeholder="Your Name" 
            className="w-full px-4 py-3 transition-all bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input 
            type="email" 
            placeholder="Your Email" 
            className="w-full px-4 py-3 transition-all bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.textarea 
            rows="4" 
            placeholder="Your Message" 
            className="w-full px-4 py-3 transition-all bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            whileFocus={{ scale: 1.05 }}
          ></motion.textarea>

          <motion.button 
            type="submit" 
            className="w-full px-6 py-3 text-lg font-semibold text-black transition-all bg-orange-500 rounded-md hover:bg-orange-600 hover:scale-105"
            whileHover={{ scale: 1.1 }}
          >
            Send Message
          </motion.button>
        </form>
      </motion.div> */}

      {/* Social Links - Floating Icons */}
      <motion.div 
        className="flex gap-6 mt-8"
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
          className="flex flex-col items-center text-center transition-all transform hover:scale-110"
          whileHover={{ y: -5, boxShadow: "0px 5px 15px rgba(255, 165, 0, 0.5)" }}
          aria-label={`Link to ${social.name}`}
        >
          <img src={social.icon} alt={`Link to ${social.name}`} className="w-12 h-12 transition-all" />
          <p className="mt-2 text-sm">{social.name}</p>
        </motion.a>
        
        ))}
      </motion.div>
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1, delay: 1 } }}
        viewport={{ once: true }}
      >
        <p className="text-xl">Email: <a href="mailto:krishna200428@gmail.com" className="text-orange-500 hover:underline">krishna200428@gmail.com</a></p>
        <p className="mt-4 text-xl">Phone: <a href="tel:+91 9016116357" className="text-orange-500 hover:underline">+91 98765 43210</a></p>
      </motion.div>

    </section>
  );
};

export default ContactMe;
