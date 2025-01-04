// components/FeedbackForm.tsx

'use client';
import React, { useState } from "react";
import SectionHeading from "../../SectionHeading"; // Assuming you have this component
import { CgClose } from "react-icons/cg"; // Close icon from react-icons

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formVisible, setFormVisible] = useState(false); // State to control the visibility of the form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div id="feedback" className="w-full min-h-screen bg-[#050709] py-16 px-4 flex justify-center items-center flex-col">
      {/* Section Heading */}
      <SectionHeading>Feedback</SectionHeading>

      {/* Fill Form Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setFormVisible(true)} // Open form on button click
          className="bg-blue-600 text-white py-3 px-6 rounded-full text-xl font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          Fill Form
        </button>
      </div>

      {/* Transparent Feedback Form (Visible when `formVisible` is true) */}
      {formVisible && (
        <div className="bg-white bg-opacity-20 backdrop-blur-lg border border-white/20 rounded-lg p-8 max-w-lg w-full shadow-lg mt-8 relative">
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <CgClose
              onClick={() => setFormVisible(false)} // Close the form on click
              className="text-white text-2xl cursor-pointer hover:text-red-500 transition-all duration-300"
            />
          </div>

          <h2 className="text-center text-3xl font-semibold text-white mb-8">We'd love to hear your feedback</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white text-lg">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 bg-transparent border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white text-lg">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 bg-transparent border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-white text-lg">Message</label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 mt-2 bg-transparent border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Your feedback"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
