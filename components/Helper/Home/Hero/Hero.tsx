import React from "react";
import { BaseInfo } from "@/Data/data"; // Assuming you have the image and data here
import Image from "next/image"; // Image component from Next.js
import Link from "next/link";
const Hero = () => {
  return (
    <div className="w-full pt-[4vh] md:pt-[12vh] h-screen bg-[#050709] overflow-hidden relative z-10">
      <div className="flex justify-center flex-col w-4/5 h-full mx-auto">
        {/* Flex container to arrange text and image side by side */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="lg:w-1/2 text-white">
            
            <h1 className="text-bg text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold md:leading-[3rem] lg:leading-[3.5rem] xl:leading-[5rem]">
              {BaseInfo.position}
            </h1>
            <p className="mt-6 text-sm md:text-base text-white text-opacity-60">
              {BaseInfo.description}
            </p>
            <button className="md:px-8 md:py-2.5 px-6 py-1.5 text-white font-semibold text-sm md:text-lg transition-all duration-200 rounded-lg mt-8 bg-blue-700 hover:bg-blue-900 flex items-center space-x-2">
              <Link href="/AkashDongreResume.pdf" download="Resume" className="flex items-center space-x-2">
              <span>Download Resume</span>
              </Link>
            </button>
          </div>

          {/* Image Content */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
            <div className="mx-auto w-full max-w-[500px] sm:max-w-[400px] lg:max-w-[500px]">
              <Image
                src={BaseInfo.CICD} // Using the cicd image from data
                alt="CI/CD Image"
                width={500} // Set max width
                height={500} // Set max height
                objectFit="cover" // Ensures the image covers its container, preventing stretching
                layout="intrinsic" // Allows the image to scale while maintaining its aspect ratio
                className="rounded-[3rem]" // Optional rounded corners
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
