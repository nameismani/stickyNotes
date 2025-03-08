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

      // Limit the number of toasts per position
      setToasts((prev) => {
        const positionToasts = prev.filter((t) => t.position === position);
        if (positionToasts.length >= 3) {
          return [
            ...prev.filter((t) => t.position !== position),
            ...positionToasts.slice(1),
            { id, message, type, position },
          ];
        }
        return [...prev, { id, message, type, position }];
      });
    },
    []
  );

  const handleClose = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Group toasts by position */}
      <div className="fixed inset-0 pointer-events-none flex flex-col items-end justify-start gap-4 p-4 z-50">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              position={toast.position}
              onClose={handleClose}
            />
          </div>
        ))}
      </div>
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
