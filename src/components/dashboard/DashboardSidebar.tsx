"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // adjust if `db` (Firestore instance) is exported elsewhere
import { logout } from "@/lib/firebase/auth";
import { recordSignOut } from "@/lib/firestore/users";
import type { UserRole } from "@/lib/firestore/types";
import { Pin, LogOut } from "lucide-react";

type NavItem = {
    href: string;
    label: string;
    /** key into the live `counts` state — omit for items with no badge */
    countKey?: "jobs" | "applications";
};

const EMPLOYER_NAV: NavItem[] = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/jobs", label: "My jobs", countKey: "jobs" },
    { href: "/dashboard/applications", label: "Applications", countKey: "applications" },
];

const JOBSEEKER_NAV: NavItem[] = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/applications", label: "My applications", countKey: "applications" },
];

export default function DashboardSidebar({ role }: { role: UserRole }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [counts, setCounts] = useState<{ jobs?: number; applications?: number }>({});

    const navItems = role === "employer" ? EMPLOYER_NAV : JOBSEEKER_NAV;

    // Live counts from Firestore — adjust field names below to match your schema.
    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const unsubscribers: Array<() => void> = [];

        if (role === "employer") {
            const jobsQ = query(collection(db, "jobs"), where("employerId", "==", uid));
            unsubscribers.push(
                onSnapshot(jobsQ, (snap) => {
                    setCounts((c) => ({ ...c, jobs: snap.size }));
                })
            );

            const appsQ = query(collection(db, "applications"), where("employerId", "==", uid));
            unsubscribers.push(
                onSnapshot(appsQ, (snap) => {
                    setCounts((c) => ({ ...c, applications: snap.size }));
                })
            );
        } else {
            const appsQ = query(collection(db, "applications"), where("applicantId", "==", uid));
            unsubscribers.push(
                onSnapshot(appsQ, (snap) => {
                    setCounts((c) => ({ ...c, applications: snap.size }));
                })
            );
        }

        return () => unsubscribers.forEach((unsub) => unsub());
    }, [role]);

    async function handleLogout() {
        setIsSigningOut(true);
        const uid = auth.currentUser?.uid;
        if (uid) {
            await recordSignOut(uid);
        }
        await logout();
        setIsSigningOut(false);
        router.push("/");
    }

    return (
        <aside
            className="w-56 shrink-0 border-r-2 border-[#191611] min-h-screen flex flex-col p-4"
            style={{ backgroundColor: "#F4EFE2" }}
        >
            <Link href="/" className="flex items-center gap-2 mb-8 px-2">
                <span className="w-7 h-7 rounded-full bg-[#1E2A1F] flex items-center justify-center shrink-0">
                    <Pin className="w-3.5 h-3.5 text-[#E2A73B]" />
                </span>
                <span
                    className="text-lg font-bold text-[#191611] tracking-tight"
                    style={{ fontFamily: "'Fraunces', serif" }}
                >
                    POSTED
                </span>
            </Link>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const count = item.countKey ? counts[item.countKey] : undefined;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between rounded-sm px-3 py-2 text-sm font-medium transition-colors border-l-4 ${isActive
                                    ? "bg-[#191611] text-[#F4EFE2] border-[#E2A73B]"
                                    : "text-[#191611]/70 border-transparent hover:bg-[#191611]/5 hover:text-[#191611]"
                                }`}
                        >
                            <span>{item.label}</span>
                            {count !== undefined && (
                                <span
                                    className={`font-mono text-[10px] rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${isActive
                                            ? "bg-[#E2A73B] text-[#191611]"
                                            : "bg-[#191611]/10 text-[#191611]/70"
                                        }`}
                                >
                                    {count}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <button
                type="button"
                onClick={handleLogout}
                disabled={isSigningOut}
                className="flex items-center justify-center gap-2 rounded-sm border-2 border-[#191611]/25 text-sm font-medium px-3 py-2 text-[#191611] hover:border-[#B0473F] hover:text-[#B0473F] disabled:opacity-60 transition-colors"
            >
                <LogOut className="w-3.5 h-3.5" />
                {isSigningOut ? "Signing out…" : "Sign out"}
            </button>
        </aside>
    );
}