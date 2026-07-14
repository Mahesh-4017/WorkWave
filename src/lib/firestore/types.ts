import type { Timestamp } from "firebase/firestore";

/**
 * Collection: "users"
 * Doc ID: Firebase Auth uid (1:1 with the auth user)
 */
export type UserRole = "jobseeker" | "employer" | "admin";

export interface UserProfile {
  uid: string; // matches Firebase Auth uid + doc id
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastSignInAt: Timestamp | null;
  lastSignOutAt: Timestamp | null;
}

/**
 * Collection: "jobs"
 * Doc ID: auto-generated
 * Relation: jobs.employerId -> users.uid (many jobs per employer)
 */
export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type JobStatus = "open" | "closed";

export interface Job {
  id: string; // doc id
  employerId: string; // -> UserProfile.uid
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  salaryMin: number | null;
  salaryMax: number | null;
  status: JobStatus;
  applicantCount: number; // denormalized counter, kept in sync by applications.ts
  viewCount: number; // denormalized counter, incremented by incrementJobView()
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Collection: "applications"
 * Doc ID: `${jobId}_${applicantId}` — deterministic, so a user can only
 * apply once per job (the write becomes idempotent / naturally unique).
 * Relations:
 *   applications.jobId       -> jobs.id
 *   applications.applicantId -> users.uid
 *   applications.employerId  -> users.uid (denormalized from the job, for employer-side queries)
 */
export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface Application {
  id: string; // `${jobId}_${applicantId}`
  jobId: string; // -> Job.id
  applicantId: string; // -> UserProfile.uid
  employerId: string; // -> UserProfile.uid (denormalized from the job)
  status: ApplicationStatus;
  coverLetter: string | null;
  resumeUrl: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function applicationId(jobId: string, applicantId: string): string {
  return `${jobId}_${applicantId}`;
}
