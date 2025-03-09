"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const getServerSessionDetail = async (): Promise<{
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
} | null> => {
  const session = await getServerSession(options);
  return session;
};

export const deleteNoteServerAction = async (
  noteId: string
): Promise<{
  success: boolean;
  status: number;
  message: string;
}> => {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized",
      };
    }

    const accessToken = session.accessToken;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notes/${noteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Return a serializable object instead of the Response
    if (response.ok) {
      revalidatePath("/home");
    }
    return {
      success: response.ok,
      status: response.status,
      message: response.ok
        ? "Note deleted successfully"
        : `Error: ${response.status} ${response.statusText}`,
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    return {
      success: false,
      status: 500,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
