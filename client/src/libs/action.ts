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

export const deleteNoteServerAction = async (noteId: string): Promise<any> => {
  const session = await getServerSession(options);
  if (!session) {
    return { error: "Unauthorized" };
  }

  const user = session.user;
  const accessToken = session.accessToken;
  console.log(
    noteId,
    user,
    accessToken,
    process.env.NEXT_PUBLIC_API_URL,
    "noteId"
  );
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
};
