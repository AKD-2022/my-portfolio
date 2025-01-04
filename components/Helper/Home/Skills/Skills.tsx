"use client";
import React, { useState, useEffect } from "react";
import SectionHeading from "../../SectionHeading";
import { skillsData } from "@/Data/data"; // Import skills data


const Skills = () => {
    // State to control when to stop the scrolling
    const [isHovered, setIsHovered] = useState(false);

    // Functions to pause scrolling on hover
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Scroll speed and interval for auto scroll
    const scrollSpeed = 2;

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                const scrollContainer = document.getElementById("skillsCarousel");
                if (scrollContainer) {
                    scrollContainer.scrollLeft += scrollSpeed;
                    if (scrollContainer.scrollLeft + scrollContainer.offsetWidth >= scrollContainer.scrollWidth) {
                        scrollContainer.scrollLeft = 0; // Reset when end is reached
                    }
                }
            }
        }, 30); // Interval duration in ms, adjust to change scrolling speed

        return () => clearInterval(interval);
    }, [isHovered]);

    return (
       
        <div id="skills"className="pt-16 pb-16 bg-[#050709]">
            <SectionHeading>Skills and Tools</SectionHeading>
            
            {/* Skills Carousel */}
            <div className="w-[90%] mx-auto mt-20 relative">
                <div 
                    id="skillsCarousel" 
                    className="flex gap-8 overflow-x-auto items-center py-4 scrollbar-hidden"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                >
                    {skillsData.map((skill) => (
                        <div key={skill.id} className="flex-shrink-0 bg-[#1a1c22] p-6 rounded-lg shadow-lg text-center">
                            <img 
                                src={skill.image} 
                                alt={skill.title} 
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-4" 
                            />
                            <p className="text-white text-sm">{skill.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
   
    );
};

export default Skills;
