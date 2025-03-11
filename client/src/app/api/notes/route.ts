import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

import { dbConnection } from "@/port/db.connection";
import { getUserFromToken } from "@/utils/auth-utils";
import { NoteModel } from "@/model/note.model";

dbConnection();

export async function POST(request: NextRequest) {
  try {
    const { userId, user } = await getUserFromToken(request);

    const body = await request.json();
    const { note_title, note_content, color } = body;

    if (!note_title || !note_content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newNote = new NoteModel({
      note_id: uuidv4(),
      user_id: userId,
      note_title,
      note_content,
      color: color || "#ffffff",
      created_by: user.user_name,
      create_on: Math.floor(Date.now() / 1000),
      last_update: Math.floor(Date.now() / 1000),
    });

    await newNote.save();
    return NextResponse.json(newNote, { status: 201 });
  } catch (error: any) {
    console.error("Create note error:", error);
    return NextResponse.json(
      { error: error.message || "Could not create note" },
      { status: error.message.includes("Authentication failed") ? 401 : 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getUserFromToken(request);

    const notes = await NoteModel.find({ user_id: userId });
    return NextResponse.json(notes);
  } catch (error: any) {
    console.error("Get notes error:", error);
    return NextResponse.json(
      { error: error.message || "Could not retrieve notes" },
      { status: error.message.includes("Authentication failed") ? 401 : 500 }
    );
  }
}
