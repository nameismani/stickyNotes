"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: true });
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {session?.user?.name || session?.user?.email}!
          </h2>
          <p className="text-gray-600">
            You're now logged in to the protected area of the application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-orange-700 mb-2">
              User Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Email:</span>{" "}
                {session?.user?.email}
              </p>
              <p>
                <span className="font-medium">User ID:</span>{" "}
                {session?.user?.id}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-blue-700 mb-2">
              Session Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Session Active:</span> Yes
              </p>
              <p>
                <span className="font-medium">Authentication Method:</span>{" "}
                Credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
