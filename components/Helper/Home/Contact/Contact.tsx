import React from "react";
import { FaPhoneAlt, FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt } from "react-icons/fa"; // Add FaMapMarkerAlt for the address
import { contactInfo } from "@/Data/data"; // Import the contact data
import SectionHeading from "../../SectionHeading";

const Contact = () => {
  return (
<div id="contact" className="pt-16 pb-16 bg-[#050709]">
<SectionHeading>Contact Me</SectionHeading>
      <div className="text-center">
        <p className="text-sm sm:text-base mt-2 text-gray-400">
          Feel free to reach out to me via any of the channels below.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-center gap-10">
        {/* Phone */}
        <div className="flex items-center gap-4 bg-[#1e1e2f] p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-200">
          <FaPhoneAlt className="text-3xl text-blue-500" />
          <a
            href={`tel:${contactInfo.phoneNumber}`}
            className="text-lg sm:text-xl font-semibold text-white hover:text-blue-500"
          >
            {contactInfo.phoneNumber}
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4 bg-[#1e1e2f] p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-200">
          <FaEnvelope className="text-3xl text-blue-500" />
          <a
            href={`mailto:${contactInfo.email}?subject=Contacting%20from%20Portfolio`}
            className="text-lg sm:text-xl font-semibold text-white hover:text-blue-500"
          >
            {contactInfo.email}
          </a>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-10">
        {/* GitHub */}
        <div className="flex items-center gap-4 bg-[#1e1e2f] p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-200">
          <FaGithub className="text-3xl text-blue-500" />
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg sm:text-xl font-semibold text-white hover:text-blue-500"
          >
            GitHub
          </a>
        </div>

        {/* LinkedIn */}
        <div className="flex items-center gap-4 bg-[#1e1e2f] p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-200">
          <FaLinkedin className="text-3xl text-blue-500" />
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg sm:text-xl font-semibold text-white hover:text-blue-500"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-12 flex justify-center gap-10">
        {/* Address */}
        <div className="flex items-center gap-4 bg-[#1e1e2f] p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-200">
          <FaMapMarkerAlt className="text-3xl text-blue-500" />
          <p className="text-lg sm:text-xl font-semibold text-white">
            {contactInfo.address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
