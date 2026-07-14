import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Application, ApplicationStatus } from "./types";
import { applicationId } from "./types";

const appsCol = "applications";

export async function createApplication(params: {
  jobId: string;
  applicantId: string;
  employerId: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
}): Promise<string> {
  const id = applicationId(params.jobId, params.applicantId);
  const ref = doc(db, appsCol, id);
  await addDoc(collection(db, appsCol), {
    id,
    jobId: params.jobId,
    applicantId: params.applicantId,
    employerId: params.employerId,
    status: "pending" satisfies ApplicationStatus,
    coverLetter: params.coverLetter ?? null,
    resumeUrl: params.resumeUrl ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * All applications submitted by one job seeker.
 * NOTE: orderBy("createdAt") removed until the composite index is deployed.
 * Run: firebase deploy --only firestore:indexes  to restore sorted order.
 */
export async function listApplicationsByApplicant(
  applicantId: string
): Promise<Application[]> {
  const q = query(
    collection(db, appsCol),
    where("applicantId", "==", applicantId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Application);
}

/**
 * All applications received by one employer (across all their jobs).
 * NOTE: orderBy removed until composite index is deployed.
 */
export async function listApplicationsByEmployer(
  employerId: string
): Promise<Application[]> {
  const q = query(
    collection(db, appsCol),
    where("employerId", "==", employerId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Application);
}

/**
 * All applications for a specific job (employer-side review).
 * NOTE: orderBy removed until composite index is deployed.
 */
export async function listApplicationsByJob(jobId: string): Promise<Application[]> {
  const q = query(
    collection(db, appsCol),
    where("jobId", "==", jobId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Application);
}

export async function updateApplicationStatus(
  jobId: string,
  applicantId: string,
  status: ApplicationStatus
): Promise<void> {
  const id = applicationId(jobId, applicantId);
  await updateDoc(doc(db, appsCol, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

