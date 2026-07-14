"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import HomeAfter from "@/app/Home/HomeAfter/page";
import HomeBefore from "@/app/Home/HomeBefore/page";
import { Pin } from "lucide-react";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#E7E0CE" }}
      >
        <span className="w-10 h-10 rounded-full bg-[#1E2A1F] flex items-center justify-center animate-pulse">
          <Pin className="w-5 h-5 text-[#E2A73B]" />
        </span>
      </div>
    );
  }

  return user ? <HomeAfter /> : <HomeBefore />;
}