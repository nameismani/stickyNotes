import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiGrid,
  FiList,
  FiAlertCircle,
} from "react-icons/fi";
import StickyNote from "./StickyNote";
import NoteEditorModal from "./NoteEditorModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Note,
  addNote,
  updateNote,
  deleteNote,
  fetchNotes,
  addNoteAsync,
  updateNoteAsync,
  deleteNoteAsync,
} from "@/redux/slices/notesSlice";
import useAxios from "@/hooks/useAxios";
import { deleteNoteServerAction } from "@/libs/action";

type ViewMode = "grid" | "list";

const NotesBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: notes,
    status,
    error,
  } = useAppSelector((state) => state.notes);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const {
    data,
    error: updateError,
    put: updateNote,
  } = useAxios(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`, true);

  // Fetch notes on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotes());

      // if (notes.length === 0) {
      //   dispatch(
      //     addNote({
      //       title: "Welcome to Sticky Notes!",
      //       content:
      //         "Click the + button to add a new note.\nClick on a note to edit it.",
      //       color: "#FFC107",
      //     })
      //   );
      //   dispatch(
      //     addNote({
      //       title: "Shopping List",
      //       content: "• Milk\n• Eggs\n• Bread\n• Chocolate",
      //       color: "#4CAF50",
      //     })
      //   );
      //   dispatch(
      //     addNote({
      //       title: "Project Ideas",
      //       content:
      //         "1. Mobile app for task management\n2. Portfolio website\n3. Recipe sharing platform",
      //       color: "#2196F3",
      //     })
      //   );
      // }
    }
  }, [dispatch, status]);
  useEffect(() => {
    console.log(notes, "notes");
  }, [notes]);

  // Filter notes based on search query
  const filteredNotes =
    notes?.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery?.toLowerCase())
    ) ?? [];

  const handleAddNote = () => {
    setCurrentNote(undefined);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (note: Partial<Note>) => {
    if (note.id) {
      // Update existing note
      // dispatch(updateNote(note as Note));
      // Through Asyncthunk API:
      // dispatch(updateNoteAsync(note as Note));
      // through custom hook with axios
      await updateNote(
        {
          note_title: note.title || "",
          note_content: note.content || "",
          color: note.color || "#FFC107",
        },
        { id: note.id }
      ).finally(() => {
        dispatch(fetchNotes());
      });
    } else {
      // Add new note
      // dispatch(
      //   addNote({
      //     title: note.title || "",
      //     content: note.content || "",
      //     color: note.color || "#FFC107",
      //   })
      // );
      // If API is available:
      dispatch(
        addNoteAsync({
          title: note.title || "",
          content: note.content || "",
          color: note.color || "#FFC107",
        })
      ).finally(() => {
        dispatch(fetchNotes());
      });
    }
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      // dispatch(deleteNote(id));
      // If API is available:
      // dispatch(deleteNoteAsync(id));
      deleteNoteServerAction(id).then((res: any) => {
        console.log(res, "res");
        if (res?.ok) {
          dispatch(fetchNotes());
        }
      });
    }
  };

  // Layout variants for the grid/list view
  const gridLayoutClass =
    viewMode === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "flex flex-col space-y-4";

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">My Sticky Notes</h2>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:max-w-[260px]">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch size={20} />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white shadow" : "text-gray-600"
              }`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <FiGrid size={20} />
            </button>
            <button
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white shadow" : "text-gray-600"
              }`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <FiList size={20} />
            </button>
          </div>

          {/* Add Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg font-medium shadow-md hover:bg-orange-600 transition-colors"
            onClick={handleAddNote}
          >
            <FiPlus size={20} />
            <span>Add Note</span>
          </motion.button>
        </div>
      </div>

      {/* Notes Grid/List */}
      {status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : status === "failed" ? (
        <div className="flex flex-col items-center justify-center h-64 text-center p-4">
          <FiAlertCircle size={40} color="#ef4444" />
          {/* className="mb-4" */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Notes
          </h3>
          <p className="text-gray-600">
            {error || "An unexpected error occurred"}
          </p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center p-4 bg-gray-50 rounded-lg">
          <img
            src="/empty-notes.svg" // You'll need to create or find this SVG
            alt="No notes found"
            className="w-32 h-32 mb-4 opacity-70"
          />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchQuery ? "No matching notes found" : "No notes yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? `Try a different search term or clear your search`
              : `Click the "Add Note" button to create your first note!`}
          </p>
          {searchQuery && (
            <button
              className="text-orange-500 underline"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className={gridLayoutClass}>
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <StickyNote
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Note Editor Modal */}
      <NoteEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        note={currentNote}
      />
    </div>
  );
};

export default NotesBoard;
