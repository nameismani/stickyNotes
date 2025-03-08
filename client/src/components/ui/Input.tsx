import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  type = "text",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          className={`
            block text-sm font-medium mb-1.5
            transition-colors duration-200
            ${isFocused ? "text-orange-500" : "text-gray-700"}
          `}
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className={`
            w-full px-4 py-2.5
            border-2 rounded-lg
            transition-all duration-200
            bg-white
            ${
              error
                ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                : `border-gray-200 
                   group-hover:border-orange-200
                   group-hover:shadow-[0_2px_4px_rgba(0,0,0,0.04)]
                   focus:border-orange-500
                   focus:shadow-[0_4px_12px_rgba(255,87,34,0.12)]
                  `
            }
            focus:outline-none
            placeholder:text-gray-400
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400
              focus:outline-none
              transition-colors duration-200
              p-1.5 rounded-full
              hover:text-orange-500
              ${isFocused ? "text-orange-400" : ""}
            `}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
