import { motion } from "framer-motion";
import { useState } from "react";

const ContactMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setResponseMessage("Thanks for reaching out! We'll get back to you shortly.");
    }, 2000);
  };

  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center w-full min-h-screen px-6 py-16 text-white bg-gradient-to-t from-black to-slate-950"
    >
      {/* Heading */}
      <motion.h2
        className="mb-8 text-3xl font-bold tracking-wide text-center sm:text-4xl md:text-5xl"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        Get in Touch
      </motion.h2>

      {/* Form Card */}
      <motion.div
        className="w-full max-w-md p-6 border shadow-lg sm:max-w-lg sm:p-8 rounded-xl bg-white/10 backdrop-blur-md border-white/20"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-3 text-sm transition-all bg-transparent border border-gray-500 rounded-md sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            whileFocus={{ scale: 1.05 }}
            required
          />
          <motion.input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-3 text-sm transition-all bg-transparent border border-gray-500 rounded-md sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            whileFocus={{ scale: 1.05 }}
            required
          />
          <motion.textarea
            rows="4"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full px-4 py-3 text-sm transition-all bg-transparent border border-gray-500 rounded-md sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            whileFocus={{ scale: 1.05 }}
            required
          ></motion.textarea>

          <motion.button
            type="submit"
            className="w-full px-6 py-3 text-sm font-semibold text-black transition-all bg-orange-500 rounded-md sm:text-base hover:bg-orange-600 hover:scale-105"
            whileHover={{ scale: 1.1 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </motion.button>
        </form>

        {responseMessage && (
          <div className="mt-4 text-sm text-center text-gray-200 sm:text-base">
            {responseMessage}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ContactMe;
