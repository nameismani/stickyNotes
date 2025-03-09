import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { Note, noteColors } from "@/redux/slices/notesSlice";

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  note?: Note;
}

const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  note,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(noteColors.at(0));

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
    } else {
      setTitle("");
      setContent("");
      setColor(
        noteColors?.at(Math.floor(Math.random() * noteColors.length)) ||
          noteColors[0]
      );
    }
  }, [note, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      ...(note && { id: note.id }),
      title,
      content,
      color,
    });

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            onKeyDown={handleKeyDown}
          >
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-1 h-2" style={{ backgroundColor: color }} />

              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {note ? "Edit Note" : "Create New Note"}
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Note Title"
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px]"
                    placeholder="Note content..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {noteColors.map((noteColor) => (
                      <button
                        key={noteColor}
                        type="button"
                        className={`w-6 h-6 rounded-full transition-transform ${
                          color === noteColor
                            ? "ring-2 ring-offset-2 ring-gray-700 scale-110"
                            : ""
                        }`}
                        style={{ backgroundColor: noteColor }}
                        onClick={() => setColor(noteColor)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={!title.trim()}>
                    {note ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NoteEditorModal;
