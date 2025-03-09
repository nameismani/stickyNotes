import React, { useState } from "react";

interface AuthTabsProps {
  defaultTab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
  children: React.ReactNode;
}

interface AuthTabChildProps {
  activeTab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({
  defaultTab = "login",
  onTabChange,
  children,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabChange = (tab: "login" | "register") => {
    if (!isAnimating) {
      setIsAnimating(true);
      onTabChange(tab);

      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div>
      <div className="flex relative mb-8">
        <button
          type="button"
          className={`w-1/2 py-3 text-center font-medium transition-all duration-300 ${
            defaultTab === "login"
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("login")}
          disabled={isAnimating}
        >
          Login
        </button>
        <button
          type="button"
          className={`w-1/2 py-3 text-center font-medium transition-all duration-300 ${
            defaultTab === "register"
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("register")}
          disabled={isAnimating}
        >
          Register
        </button>

        {/* Animated Bottom Border */}
        <div className="absolute bottom-0 w-full h-[1px] bg-gray-200" />
        <div
          className={`absolute bottom-0 w-1/2 h-0.5 bg-orange-500 transition-transform duration-300 ease-in-out ${
            defaultTab === "login" ? "translate-x-0" : "translate-x-full"
          }`}
        />
      </div>

      {/* Content container with custom scrollbar */}
      <div className="relative h-[420px] overflow-y-auto register-custom-scrollbar">
        {/* <style jsx>{`
       
        `}</style> */}
        <div className="absolute inset-0">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                activeTab: defaultTab,
                onTabChange: handleTabChange,
              } as AuthTabChildProps);
            }
            return child;
          })}
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;
