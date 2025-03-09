import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash, FiCheckCircle } from "react-icons/fi";
import { Note } from "@/redux/slices/notesSlice";

interface StickyNoteProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const StickyNote: React.FC<StickyNoteProps> = ({ note, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format the date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, rotate: -5 }}
      whileHover={{ scale: 1.03, rotate: 1, zIndex: 10 }}
      style={{ backgroundColor: note.color }}
      className="relative rounded-lg shadow-lg p-4 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Actions */}
      <motion.div
        className="absolute top-2 right-2 flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={() => onEdit(note)}
          className="p-1.5 bg-white/40 hover:bg-white/60 rounded-full transition-colors"
        >
          <FiEdit size={16} />
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-1.5 bg-white/40 hover:bg-white/60 rounded-full transition-colors"
        >
          <FiTrash size={16} />
        </button>
      </motion.div>

      {/* Note Content */}
      <div className="mt-1 mb-3">
        <h3 className="font-bold text-lg mb-2 pr-14 break-words">
          {note.title}
        </h3>
        <p className="whitespace-pre-wrap break-words text-sm">
          {note.content}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 mt-auto border-t border-black/10 text-xs text-black/60 flex justify-between items-center">
        <span>{formatDate(note.updatedAt)}</span>
        {note.createdAt !== note.updatedAt && (
          <span className="flex items-center">
            <FiCheckCircle size={12} className="mr-1" /> Updated
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StickyNote;
