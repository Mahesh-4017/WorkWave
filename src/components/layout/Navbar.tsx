"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await signOut(auth);
    router.push("/");
  }

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Account";
  const initial = (user?.displayName?.[0] || user?.email?.[0] || "?").toUpperCase();

  return (
    <header className="border-b-4 border-[#191611]" style={{ backgroundColor: "#1E2A1F" }}>
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-2xl tracking-tight text-[#F4EFE2] font-bold"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              POSTED
            </span>
            <span className="hidden sm:inline-block text-[10px] tracking-[0.2em] uppercase text-[#E2A73B] border border-[#E2A73B]/50 rounded-full px-2 py-0.5 font-mono">
              Board №04
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-[#F4EFE2]/80 font-mono uppercase tracking-wide">
          <a href="#" className="hover:text-[#E2A73B] transition-colors">
            Browse board
          </a>
          <a href="#" className="hover:text-[#E2A73B] transition-colors">
            Companies
          </a>
          <a href="#" className="hover:text-[#E2A73B] transition-colors">
            Salary notes
          </a>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {authLoading ? (
            <div className="w-8 h-8 rounded-full bg-[#F4EFE2]/10 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-[#F4EFE2]/20 hover:border-[#E2A73B]/60 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-[#E2A73B] text-[#191611] text-xs font-bold flex items-center justify-center font-mono">
                  {initial}
                </span>
                <span className="hidden sm:inline text-[#F4EFE2] text-xs font-mono max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#F4EFE2]/60 transition-transform ${menuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#F4EFE2] border-2 border-[#191611] rounded-sm z-50"
                  style={{ boxShadow: "4px 4px 0px #191611" }}
                >
                  <div className="px-4 py-3 border-b border-[#191611]/15">
                    <p className="text-sm font-semibold text-[#191611] truncate">
                      {user.displayName || "Board member"}
                    </p>
                    <p className="font-mono text-[11px] text-[#191611]/60 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#191611] hover:bg-[#191611]/5"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#191611]/60" />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#191611] hover:bg-[#191611]/5"
                    >
                      <Settings className="w-4 h-4 text-[#191611]/60" />
                      Settings
                    </Link>
                  </div>
                  <div className="py-1 border-t border-[#191611]/15">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#B0473F] hover:bg-[#B0473F]/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#F4EFE2]/90 hover:text-[#E2A73B] font-mono text-xs uppercase tracking-wide"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="bg-[#E2A73B] text-[#191611] text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-sm hover:bg-[#f0b94a] transition-colors"
              >
                Post a role
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}