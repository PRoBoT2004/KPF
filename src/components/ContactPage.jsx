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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with your actual backend logic if necessary)
    setTimeout(() => {
      setIsSubmitting(false);
      setResponseMessage("Thanks for reaching out! We'll get back to you shortly.");
    }, 2000); // Simulating an API request delay
  };

  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center w-screen h-screen px-8 py-24 text-white bg-linear-to-t from-black to-slate-950"
    >
      <motion.h2
        className="mb-8 text-5xl font-bold tracking-wide text-center"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        Get in Touch
      </motion.h2>

      {/* Contact Form */}
      <motion.div
        className="w-full max-w-lg p-8 border shadow-lg rounded-xl bg-white/10 backdrop-blur-md border-white/20"
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
            className="w-full px-4 py-3 transition-all bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            whileFocus={{ scale: 1.05 }}
            required
          />
          <motion.input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-3 transition-all bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            whileFocus={{ scale: 1.05 }}
            required
          />
          <motion.textarea
            rows="4"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full px-4 py-3 transition-all bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            whileFocus={{ scale: 1.05 }}
            required
          ></motion.textarea>

          <motion.button
            type="submit"
            className="w-full px-6 py-3 text-lg font-semibold text-black transition-all bg-orange-500 rounded-md hover:bg-orange-600 hover:scale-105"
            whileHover={{ scale: 1.1 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </motion.button>
        </form>

        {/* Success message after form submission */}
        {responseMessage && (
          <div className="mt-4 text-lg text-center text-gray-200">
            {responseMessage}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ContactMe;
