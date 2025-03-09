import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import api from "@/services/api";

// Define the Note type
export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  items: Note[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NotesState = {
  items: [],
  status: "idle",
  error: null,
};

// Color palette for sticky notes
export const noteColors = [
  "#FFC107", // Amber
  "#FF9800", // Orange
  "#FF5722", // Deep Orange
  "#F44336", // Red
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#673AB7", // Deep Purple
  "#3F51B5", // Indigo
  "#2196F3", // Blue
  "#03A9F4", // Light Blue
  "#00BCD4", // Cyan
  "#009688", // Teal
  "#4CAF50", // Green
  "#8BC34A", // Light Green
  "#CDDC39", // Lime
];

// Async thunks for API operations using the custom axios instance
export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
  const response = await api.get("/api/notes");
  console.log(response, "thunk response");
  return response.data;
});

export const addNoteAsync = createAsyncThunk(
  "notes/addNote",
  async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const response = await api.post("/api/notes", {
      // ...note,
      note_title: note.title,
      note_content: note.content,
      color: note.color,
    });

    return response.data;
  }
);

export const updateNoteAsync = createAsyncThunk(
  "notes/updateNote",
  async (note: Note) => {
    const response = await api.put(`/api/notes/${note.id}`, note);
    return response.data;
  }
);

export const deleteNoteAsync = createAsyncThunk(
  "notes/deleteNote",
  async (id: string) => {
    await api.delete(`/api/notes/${id}`);
    return id;
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    // For local operations (without API)
    addNote: (
      state,
      action: PayloadAction<Omit<Note, "id" | "createdAt" | "updatedAt">>
    ) => {
      const now = new Date().toISOString();
      state.items.push({
        id: uuidv4(),
        ...action.payload,
        createdAt: now,
        updatedAt: now,
      });
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.items.findIndex(
        (note) => note.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((note) => note.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload?.map((note: any) => ({
          id: note.note_id,
          title: note.note_title,
          content: note.note_content,
          color: note.color,
          createdAt: note.created_on,
          updatedAt: note.last_update,
        }));
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addNoteAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateNoteAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (note) => note.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteNoteAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((note) => note.id !== action.payload);
      });
  },
});

export const { addNote, updateNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
