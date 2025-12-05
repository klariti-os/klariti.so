import React from "react";
import Navigation from "./Navigation";

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative flex flex-col justify-center min-h-screen pt-20">
  
      {children}
      <Navigation />
    </div>
  );
};

export default BaseLayout;
