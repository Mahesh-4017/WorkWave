"use client";

import { createContext, useContext } from "react";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/lib/firestore/types";

export interface DashboardContextValue {
    user: User;
    profile: UserProfile | null;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
    value,
    children,
}: {
    value: DashboardContextValue;
    children: React.ReactNode;
}) {
    return (
        <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
    );
}

/** Use inside any page under app/dashboard/** — the layout guarantees this is populated. */
export function useDashboard(): DashboardContextValue {
    const ctx = useContext(DashboardContext);
    if (!ctx) {
        throw new Error("useDashboard must be used within the dashboard layout");
    }
    return ctx;
}