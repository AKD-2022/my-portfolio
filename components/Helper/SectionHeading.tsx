import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const SectionHeading = ({ children }: Props) => {
  return (
    <div className="relative w-full text-center">
      {/* Text Style */}
      <h1 className="text-white text-lg sm:text-xl md:text-2xl font-semibold uppercase tracking-wide">
        {children}
      </h1>

      {/* Horizontal Glowing Line Below the Text */}
      <div className="absolute bottom-[-10px] left-0 right-0 mx-auto">
        <span className="w-full block h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-glow"></span>
      </div>
    </div>
  );
};

export default SectionHeading;
