"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import NotesBoard from "@/components/notes/NotesBoard";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: true });
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Header with user info */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome back, {session?.user?.name || session?.user?.email}!
              </h1>
              <p className="text-gray-600 mt-1">
                Organize your thoughts with sticky notes.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main content - Notes Board */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <NotesBoard />
        </div>
      </div>
    </div>
  );
}
