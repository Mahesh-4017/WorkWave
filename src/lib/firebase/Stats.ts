import { getUserProfile } from "../firestore/users";
import { listJobsByEmployer } from "../firestore/jobs";
import { listApplicationsByApplicant, listApplicationsByEmployer } from "../firestore/applications";
import type { UserRole } from "../firestore/types";

export interface EmployerStats {
    role: "employer";
    jobsPosted: number;
    openJobs: number;
    totalViews: number;
    totalApplications: number;
    pendingApplications: number;
}

export interface JobseekerStats {
    role: "jobseeker";
    applicationsSubmitted: number;
    pendingApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
}

export type DashboardStats = EmployerStats | JobseekerStats | { role: Exclude<UserRole, "employer" | "jobseeker"> };

export async function getDashboardStats(uid: string): Promise<DashboardStats> {
    const profile = await getUserProfile(uid);
    const role = profile?.role ?? "jobseeker";

    if (role === "employer") {
        const [jobs, applications] = await Promise.all([
            listJobsByEmployer(uid),
            listApplicationsByEmployer(uid),
        ]);

        return {
            role: "employer",
            jobsPosted: jobs.length,
            openJobs: jobs.filter((j) => j.status === "open").length,
            totalViews: jobs.reduce((sum, j) => sum + (j.viewCount ?? 0), 0),
            totalApplications: applications.length,
            pendingApplications: applications.filter((a) => a.status === "pending").length,
        };
    }

    if (role === "jobseeker") {
        const applications = await listApplicationsByApplicant(uid);
        return {
            role: "jobseeker",
            applicationsSubmitted: applications.length,
            pendingApplications: applications.filter((a) => a.status === "pending").length,
            acceptedApplications: applications.filter((a) => a.status === "accepted").length,
            rejectedApplications: applications.filter((a) => a.status === "rejected").length,
        };
    }

    return { role };
}