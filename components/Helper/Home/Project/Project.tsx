"use client";
import React from "react";
import SectionHeading from "../../SectionHeading"; // Assuming you have this component

const projects = [
  {
    title: "CICD Deployment to EKS",
    description: "We have a Notus Next.js application. I built the docker image for it and created a Bitbucket pipeline. You can simply import this in Bitbucket pipeline.",
    techStack: "NextJs, Docker, AWS, Bitbucket, Terraform",
    githubLink: "https://github.com/AKD-2022/notus-nextjs_eks",
  },
  {
    title: "React-Counter-App",
    description: "A project focused on frontend design using HTML, CSS, and ReactJs. Simple and steady project.",
    techStack: "HTML, CSS, JavaScript, ReactJs",
    githubLink: "https://github.com/AKD-2022/React-Counter-App",
  },
  {
    title: "My Portfolio",
    description: "A full-stack application built with NextJs, designed to maintain my portfolio and skillset.",
    techStack: "React, NextJs, Tailwind CSS",
    githubLink: "https://github.com/AKD-2022/my-portfolio",
  },
];

const ProjectsSection = () => {
  return (
    <div
      id="projects"
      className="w-full min-h-screen py-16 px-4 bg-[#050709] flex justify-center items-center flex-col"
    >
      {/* Section Heading */}
      <SectionHeading>My Projects</SectionHeading>

      {/* Projects List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-20 backdrop-blur-lg border border-white/20 rounded-lg p-6 shadow-lg transition-all duration-300 transform hover:scale-105 relative"
          >
            {/* Project Title with Gradient */}
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 text-transparent bg-clip-text mb-4">
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
            </h3>

            {/* Project Description in Gray */}
            <p className="text-gray-400 text-lg mb-4">
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                {project.description}
                </a>
                </p>

            {/* Tech Stack */}
            <p className="text-white italic mb-4">Tech Stack: {project.techStack}</p>

            {/* GitHub Link at Fixed Position */}
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
