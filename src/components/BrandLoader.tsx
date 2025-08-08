import React from "react";

// Fire animation loader with Alpatech branding
const BrandLoader: React.FC<{ label?: string }> = ({ label = "alpatech" }) => {
  return (
    <div className="w-full h-screen grid place-items-center bg-gradient-to-b from-background to-accent/20">
      <div className="flex flex-col items-center space-y-6">
        {/* Fire on Stand Animation */}
        <div className="relative">
          {/* Stand */}
          <div className="w-16 h-8 bg-gradient-to-t from-gray-700 to-gray-500 rounded-b-lg shadow-lg border border-gray-600"></div>
          {/* Fire */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="flame"></div>
          </div>
        </div>
        
        {/* Alpatech Text */}
        <h1 className="text-4xl font-bold text-foreground tracking-wide animate-pulse drop-shadow-lg">
          {label.toUpperCase()}
        </h1>
        
        {/* Loading indicator */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce shadow-lg"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BrandLoader;
