import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    "relative rounded-lg font-medium transition-all duration-200";

  const variants = {
    primary:
      "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 disabled:bg-orange-300",
    secondary:
      "bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 disabled:bg-gray-300",
    outline:
      "border-2 border-orange-500 text-orange-500 hover:bg-orange-50 active:bg-orange-100 disabled:border-orange-300 disabled:text-orange-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const width = fullWidth ? "w-full" : "";
  const focusStyles =
    "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50";
  const disabledStyles = "disabled:cursor-not-allowed";

  const buttonClasses = [
    baseStyles,
    variants[variant],
    sizes[size],
    width,
    focusStyles,
    disabledStyles,
    className,
  ].join(" ");

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : null}
      <span className={isLoading ? "invisible" : ""}>{children}</span>
    </button>
  );
};

export default Button;
