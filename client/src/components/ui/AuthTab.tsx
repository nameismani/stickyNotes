import React, { useEffect, useState } from "react";

interface AuthTabProps {
  tab: "login" | "register";
  activeTab: "login" | "register";

  children: React.ReactNode;
}

const AuthTab: React.FC<AuthTabProps> = ({
  tab,
  activeTab,

  children,
}) => {
  const [state, setState] = useState({
    isVisible: tab === activeTab,
    direction: "center", // "left", "center", "right"
    opacity: tab === activeTab ? 1 : 0,
  });

  useEffect(() => {
    if (tab === activeTab) {
      // Make it visible first but off-screen
      setState({
        isVisible: true,
        // If we're showing login, it comes from left, if register, from right
        direction: tab === "login" ? "left" : "right",
        opacity: 0,
      });

      // Animate in
      requestAnimationFrame(() => {
        setState({
          isVisible: true,
          direction: "center",
          opacity: 1,
        });
      });
    } else if (state.isVisible) {
      // Animate out in opposite direction
      setState((prev) => ({
        ...prev,
        direction: tab === "login" ? "right" : "left",
        opacity: 0,
      }));

      // Clean up after animation
      const timer = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isVisible: false,
        }));
      }, 300); // Match transition duration

      return () => clearTimeout(timer);
    }
  }, [activeTab, tab]);

  if (!state.isVisible) {
    return null;
  }

  const getTransform = () => {
    switch (state.direction) {
      case "left":
        return "translateX(-100%)";
      case "right":
        return "translateX(100%)";
      default:
        return "translateX(0)";
    }
  };

  return (
    <div
      className="absolute top-0 left-0 w-full transition-all duration-300 ease-in-out"
      style={{
        opacity: state.opacity,
        transform: getTransform(),
        pointerEvents: tab === activeTab ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
};

export default AuthTab;
