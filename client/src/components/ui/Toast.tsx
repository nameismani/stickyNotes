"use client";

import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

export type ToastType = "success" | "error" | "info" | "warning";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  position: ToastPosition;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type,
  position,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const baseStyles =
    "fixed flex items-center justify-between w-full max-w-sm p-4 rounded-lg shadow-lg";

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  // Define transform origins based on position
  const getTransformOrigin = () => {
    switch (position) {
      case "top-right":
        return "origin-top-right";
      case "top-left":
        return "origin-top-left";
      case "bottom-right":
        return "origin-bottom-right";
      case "bottom-left":
        return "origin-bottom-left";
      default:
        return "origin-center";
    }
  };

  // Define position styles
  const getPositionStyles = () => {
    const base = "fixed";
    switch (position) {
      case "top-right":
        return `${base} top-4 right-4`;
      case "top-left":
        return `${base} top-4 left-4`;
      case "bottom-right":
        return `${base} bottom-4 right-4`;
      case "bottom-left":
        return `${base} bottom-4 left-4`;
      default:
        return base;
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 150);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4700);

    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div
      className={`
        ${baseStyles}
        ${typeStyles[type]}
        ${getPositionStyles()}
        ${getTransformOrigin()}
        transition-all duration-150 ease-in-out
        backdrop-blur-sm bg-opacity-95
        ${
          isExiting
            ? "opacity-0 scale-95 translate-y-2"
            : "opacity-100 scale-100 translate-y-0"
        }
      `}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
      >
        <FiX size={18} />
      </button>
    </div>
  );
};

export default Toast;
