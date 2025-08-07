import React from "react";

// Simple branded loader with a stylized flame on a stand and "Alpatech" text
// Uses only design tokens from index.css
const BrandLoader: React.FC<{ label?: string } > = ({ label = "Alpatech" }) => {
  return (
    <div className="w-full h-screen grid place-items-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Stand */}
          <div className="w-28 h-2 rounded-full bg-muted" />
          <div className="w-0.5 h-6 bg-muted mx-auto" />
          {/* Flame */}
          <div className="relative mx-auto">
            <div className="flame drop-shadow" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-foreground tracking-wide">
          {label}
        </h1>
      </div>
    </div>
  );
};

export default BrandLoader;
