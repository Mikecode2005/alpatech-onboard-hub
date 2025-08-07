import React from "react";

// Fire animation loader with Alpatech branding
const BrandLoader: React.FC<{ label?: string }> = ({ label = "alpatech" }) => {
  return (
    <div className="w-full h-screen grid place-items-center bg-gradient-to-b from-background to-accent/20">
      <div className="flex flex-col items-center space-y-6">
        {/* Fire on Stand Animation */}
        <div className="relative">
          {/* Stand */}
          <div className="w-16 h-8 bg-gradient-to-t from-gray-600 to-gray-400 rounded-b-lg shadow-lg"></div>
          {/* Fire */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="flame"></div>
          </div>
        </div>
        
        {/* Alpatech Text */}
        <h1 className="text-4xl font-bold text-foreground tracking-wide animate-pulse">
          {label.toUpperCase()}
        </h1>
        
        {/* Loading indicator */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BrandLoader;
