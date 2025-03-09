import React, { forwardRef, useImperativeHandle, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX, FiLoader } from "react-icons/fi";

export interface ConfirmationModalRef {
  open: (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: "danger" | "warning" | "info";
    onConfirm: () => Promise<any>;
  }) => void;
  close: () => void;
}

interface ConfirmationModalProps {
  backgroundStyle?: "transparent" | "blur" | "dim";
}

const ConfirmationModal = forwardRef<
  ConfirmationModalRef,
  ConfirmationModalProps
>(({ backgroundStyle = "blur" }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [confirmLabel, setConfirmLabel] = useState("Confirm");
  const [cancelLabel, setCancelLabel] = useState("Cancel");
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<"danger" | "warning" | "info">("danger");
  const [onConfirmCallback, setOnConfirmCallback] = useState<
    () => Promise<any>
  >(() => Promise.resolve());

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    open: (options) => {
      setTitle(options.title);
      setMessage(options.message);
      setConfirmLabel(options.confirmLabel || "Confirm");
      setCancelLabel(options.cancelLabel || "Cancel");
      setType(options.type || "danger");
      setOnConfirmCallback(() => options.onConfirm);
      setIsLoading(false);
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    },
  }));

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirmCallback();
    } catch (error) {
      console.error("Error during confirmation action:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setIsOpen(false);
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <FiAlertTriangle size={40} color="#ef4444" />,
          confirmButton: "bg-red-500 hover:bg-red-600",
        };
      case "warning":
        return {
          icon: <FiAlertTriangle size={40} color="#f59e0b" />,
          confirmButton: "bg-yellow-500 hover:bg-yellow-600",
        };
      case "info":
      default:
        return {
          icon: <FiAlertTriangle size={40} color="#3b82f6" />,
          confirmButton: "bg-blue-500 hover:bg-blue-600",
        };
    }
  };

  const getBackgroundClass = () => {
    switch (backgroundStyle) {
      case "transparent":
        return "bg-transparent";
      case "blur":
        return "bg-white/10 backdrop-blur-sm";
      case "dim":
      default:
        return "bg-black/50";
    }
  };

  const typeStyles = getTypeStyles();
  const backgroundClass = getBackgroundClass();

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${backgroundClass}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-gray-200"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">{title}</h3>
              {!isLoading && (
                <button
                  onClick={handleCancel}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>

            <div className="p-6 flex flex-col items-center">
              <div className="mb-4">{typeStyles.icon}</div>
              <p className="text-center text-gray-700">{message}</p>
              {isLoading && (
                <div className="mt-4 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-orange-500"
                  >
                    <FiLoader size={24} />
                  </motion.div>
                  <span className="ml-2 text-sm text-gray-600">
                    Processing...
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg ${
                  isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 transition-colors"
                }`}
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white flex items-center justify-center min-w-[100px] ${
                  isLoading
                    ? `${
                        typeStyles.confirmButton.split(" ")[0]
                      } opacity-70 cursor-not-allowed`
                    : typeStyles.confirmButton
                }`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2"
                    >
                      <FiLoader size={16} />
                    </motion.div>
                    Deleting...
                  </>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

ConfirmationModal.displayName = "ConfirmationModal";

export default ConfirmationModal;
