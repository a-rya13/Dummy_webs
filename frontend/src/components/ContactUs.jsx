import React, { useState } from "react";
import axios from "axios";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to send message. Try again later.");
    }
  };

  return (
    <section id="contact" className="bg-gray-100 py-12 px-6 mt-10">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            name="message"
            rows="4"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition"
          >
            Send Message
          </button>
          {status && <p className="text-center text-sm mt-2">{status}</p>}
        </form>
      </div>
    </section>
  );
}
