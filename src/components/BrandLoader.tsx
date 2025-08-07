import React from "react";

// Minimal branded loader showing only the project name
// Uses design tokens and subtle animation
const BrandLoader: React.FC<{ label?: string }> = ({ label = "alpatech" }) => {
  return (
    <div className="w-full h-screen grid place-items-center bg-background">
      <h1 className="text-3xl font-semibold text-foreground tracking-wide animate-fade-in">
        {label}
      </h1>
    </div>
  );
};

export default BrandLoader;
