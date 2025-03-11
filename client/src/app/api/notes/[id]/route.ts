import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/auth-utils";
import { NoteModel } from "@/model/note.model";
import { dbConnection } from "@/port/db.connection";

dbConnection();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getUserFromToken(request);
    const { id } = await params;

    const note = await NoteModel.findOne({
      note_id: id,
      user_id: userId,
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error: any) {
    console.error("Get note error:", error);
    return NextResponse.json(
      { error: error.message || "Could not retrieve note" },
      { status: error.message.includes("Authentication failed") ? 401 : 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, user } = await getUserFromToken(request);
    const { id } = await params;

    const body = await request.json();
    const { note_title, note_content, color } = body;

    const updateData: any = {
      ...(note_title !== undefined && { note_title }),
      ...(note_content !== undefined && { note_content }),
      ...(color !== undefined && { color }),
      last_update: Math.floor(Date.now() / 1000),
      updated_by: user.user_name,
    };

    const result = await NoteModel.findOneAndUpdate(
      { note_id: id, user_id: userId },
      { $set: updateData },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Update note error:", error);
    return NextResponse.json(
      { error: error.message || "Could not update note" },
      { status: error.message.includes("Authentication failed") ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getUserFromToken(request);
    const { id } = await params;

    const result = await NoteModel.deleteOne({
      note_id: id,
      user_id: userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Delete note error:", error);
    return NextResponse.json(
      { error: error.message || "Could not delete note" },
      { status: error.message.includes("Authentication failed") ? 401 : 500 }
    );
  }
}
