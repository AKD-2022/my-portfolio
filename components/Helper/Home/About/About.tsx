import React from "react";
import SectionHeading from "../../SectionHeading";
import { aboutInfo } from "@/Data/data";
import { FaCheck } from "react-icons/fa";
import Image from "next/image";



const About = () => {
  return (
   
    <div id="about" className="pt-16 pb-16 bg-[#050709]">
      <SectionHeading>About Me</SectionHeading>
      <div className="w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-20">
        {/* Text Content */}
        <div className="order-2 lg:order-1"> {/* Ensuring text is on left on large screens */}
          <h1 className="text-bg text-[26px] sm:text-3xl md:text-5xl font-bold text-gray-200">
            {aboutInfo.title}
          </h1>
          {/* Description Below Title */}
          <p className="mt-6 text-base text-gray-500">
            {aboutInfo.description}
          </p>
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-7 h-7 bg-blue-800 flex flex-col items-center justify-center">
                <FaCheck className="text-white" />
              </div>
              <p className="text-sm sm:text-lg font-bold text-gray-300">Site Reliability Engineer</p>
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-7 h-7 bg-blue-800 flex flex-col items-center justify-center">
                <FaCheck className="text-white" />
              </div>
              <p className="text-sm sm:text-lg font-bold text-gray-300">DevOps Engineer</p>
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-7 h-7 bg-blue-800 flex flex-col items-center justify-center">
                <FaCheck className="text-white" />
              </div>
              <p className="text-sm sm:text-lg font-bold text-gray-300">FrontEnd Development</p>
            </div>
          </div>
        </div>

        {/* Image Content */}
        <div className="order-1 lg:order-2 lg:ml-8 mt-8 lg:mt-0 flex justify-center"> {/* Added order-1 and lg:order-2 to change order on large screens */}
          <div className="mx-auto rounded-[3rem] border-[3.5px] border-blue-950 overflow-hidden w-full max-w-[350px] lg:max-w-[500px]">
            <Image
              src={aboutInfo.profilePic}
              alt={aboutInfo.name}
              width={500}
              height={500}
              objectFit="cover" // Ensures the image covers the container properly
              className="rounded-[3rem]" // Makes the image corners rounded for a smooth, modern look
            />
          </div>
        </div>
      </div>
    </div>
 
  );
};

export default About;
