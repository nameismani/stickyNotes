import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md animate-fadeIn hover:shadow-lg transition-all duration-300 p-6 w-full max-w-md ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
