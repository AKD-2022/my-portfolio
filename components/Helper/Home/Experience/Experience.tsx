import React from "react";
import SectionHeading from "../../SectionHeading";
import { experienceData } from "@/Data/data"; // Importing experience data

const Experience = () => {
    return(
        <div id="experience" className="pt-16 pb-16 bg-[#050709]">
            <SectionHeading>Experience</SectionHeading>
            
            {/* Single Card Layout */}
            <div className="w-[90%] mx-auto bg-[#1a1c22] p-10 rounded-xl shadow-2xl mt-20">
                {/* Experience Card */}
                {experienceData.map((experience, index) => (
                    <div key={index} className="flex flex-col lg:flex-row gap-8 items-center mb-8">
                        
                        {/* Left Section (Date and Company/Role) */}
                        <div className="flex flex-col lg:w-1/3 text-white">
                            <p className="text-sm text-gray-400">{experience.date}</p>
                            <h3 className="text-2xl font-semibold text-gray-200 mt-2">{experience.company} | {experience.role}</h3>
                        </div>

                        {/* Right Section (Bullet Points Description) */}
                        <div className="lg:w-2/3 text-gray-400">
                            <ul className="list-disc pl-6 mt-4">
                                {experience.description.map((task, idx) => (
                                    <li key={idx} className="mb-2">{task}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experience;
