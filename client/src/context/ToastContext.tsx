"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Toast, { ToastType, ToastPosition } from "@/components/ui/Toast";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  position: ToastPosition;
}

interface ToastContextType {
  showToast: (
    message: string,
    type: ToastType,
    position?: ToastPosition
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType,
      position: ToastPosition = "bottom-right"
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type, position }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 5000);
    },
    []
  );

  const handleClose = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    if (!acc[toast.position]) {
      acc[toast.position] = [];
    }
    acc[toast.position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, ToastMessage[]>);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed p-4 space-y-4 z-50 ${
            position.includes("top") ? "top-0" : "bottom-0"
          } ${position.includes("right") ? "right-0" : "left-0"}`}
        >
          {positionToasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              position={toast.position as ToastPosition}
              onClose={handleClose}
            />
          ))}
        </div>
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
