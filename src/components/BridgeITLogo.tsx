
import React from "react";

interface BridgeITLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
  className?: string;
}

export const BridgeITLogo: React.FC<BridgeITLogoProps> = ({ 
  size = "md", 
  withText = true,
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
    xl: "text-2xl"
  };

  const logoSrc = "/lovable-uploads/309a8f44-854d-4dfe-a92e-250bc6bba148.png";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizeClasses[size]} bridge-it-icon`}>
        <img src={logoSrc} alt="Bridge-IT Logo" className="w-full h-full object-contain" />
      </div>
      
      {withText && (
        <div className="flex flex-col">
          <span className={`bridge-it-logo ${textSizeClasses[size]}`}>Bridge-IT</span>
          <span className={`bridge-it-subtitle ${size === "sm" ? "text-xs" : "text-xs"}`}>
            live shamelessly
          </span>
        </div>
      )}
    </div>
  );
};
