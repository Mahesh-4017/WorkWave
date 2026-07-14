"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/firebase/auth";

export default function DashboardCornerButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    await logout();
    setIsSigningOut(false);
    router.refresh();
  }

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
      <Link
        href="/dashboard"
        className="rounded-full bg-blue-600 text-white text-sm font-medium px-4 py-2 shadow-md hover:bg-blue-700 transition-colors"
      >
        Dashboard
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isSigningOut}
        className="rounded-full bg-white border border-gray-300 text-sm font-medium px-4 py-2 shadow-md text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
