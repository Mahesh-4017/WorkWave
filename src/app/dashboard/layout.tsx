"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import { getUserProfile } from "@/lib/firestore/users";
import type { UserProfile } from "@/lib/firestore/types";
import { DashboardProvider } from "@/lib/contexts/DashboardContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Pin } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    getUserProfile(user.uid)
      .then((p) => {
        if (active) setProfile(p);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });
    return () => {
      active = false;
      setProfileLoading(true);
    };
  }, [user]);

  if (loading || !user || profileLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: "#E7E0CE",
          backgroundImage: "radial-gradient(rgba(25,22,17,0.055) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#1E2A1F] flex items-center justify-center animate-pulse">
            <Pin className="w-5 h-5 text-[#E2A73B]" />
          </span>
          <p className="font-mono text-xs uppercase tracking-widest text-[#191611]/60">
            Loading the board…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role={profile?.role ?? "jobseeker"} />
      <div className="flex-1" style={{ backgroundColor: "#E7E0CE" }}>
        <DashboardProvider value={{ user, profile }}>{children}</DashboardProvider>
      </div>
    </div>
  );
}