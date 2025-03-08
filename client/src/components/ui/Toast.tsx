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

  const positionStyles = {
    "top-right": "animate-toastSlideIn",
    "top-left": "animate-toastSlideInLeft",
    "bottom-right": "animate-toastSlideIn",
    "bottom-left": "animate-toastSlideInLeft",
  };

  const exitAnimations = {
    "top-right": "animate-toastSlideOut",
    "top-left": "animate-toastSlideOutLeft",
    "bottom-right": "animate-toastSlideOut",
    "bottom-left": "animate-toastSlideOutLeft",
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4700);

    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div
      className={`${baseStyles} ${typeStyles[type]} ${
        isExiting ? exitAnimations[position] : positionStyles[position]
      } transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl backdrop-blur-sm bg-opacity-95`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="relative">
          <div className="h-2 w-2 rounded-full bg-white mr-3 animate-pulse" />
        </div>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 inline-flex text-white hover:text-gray-100 focus:outline-none transform hover:rotate-90 transition-transform duration-200"
      >
        <FiX size={20} />
      </button>
    </div>
  );
};

export default Toast;
