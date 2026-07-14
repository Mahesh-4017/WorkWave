import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Job, JobStatus, JobType } from "./types";

const jobsCol = "jobs";

export async function createJob(params: {
  employerId: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  salaryMin?: number | null;
  salaryMax?: number | null;
}): Promise<string> {
  const ref = await addDoc(collection(db, jobsCol), {
    employerId: params.employerId,
    title: params.title,
    description: params.description,
    company: params.company,
    location: params.location,
    type: params.type,
    salaryMin: params.salaryMin ?? null,
    salaryMax: params.salaryMax ?? null,
    status: "open" satisfies JobStatus,
    applicantCount: 0,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getJob(jobId: string): Promise<Job | null> {
  const snap = await getDoc(doc(db, jobsCol, jobId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Job;
}

/** All jobs posted by one employer (relation: jobs.employerId -> users.uid). */
export async function listJobsByEmployer(employerId: string): Promise<Job[]> {
  const q = query(
    collection(db, jobsCol),
    where("employerId", "==", employerId)
  );
  const snap = await getDocs(q);
  const jobs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Job);
  return jobs.sort((a, b) => {
    const aSec = a.createdAt?.seconds ?? 0;
    const bSec = b.createdAt?.seconds ?? 0;
    return bSec - aSec;
  });
}

/** Public job board listing — open jobs only, most recent first. */
export async function listOpenJobs(max = 20): Promise<Job[]> {
  const q = query(
    collection(db, jobsCol),
    where("status", "==", "open")
  );
  const snap = await getDocs(q);
  const jobs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Job);
  return jobs
    .sort((a, b) => {
      const aSec = a.createdAt?.seconds ?? 0;
      const bSec = b.createdAt?.seconds ?? 0;
      return bSec - aSec;
    })
    .slice(0, max);
}

export async function updateJob(
  jobId: string,
  updates: Partial<
    Pick<
      Job,
      | "title"
      | "description"
      | "company"
      | "location"
      | "type"
      | "salaryMin"
      | "salaryMax"
      | "status"
    >
  >
): Promise<void> {
  await updateDoc(doc(db, jobsCol, jobId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function closeJob(jobId: string): Promise<void> {
  await updateJob(jobId, { status: "closed" });
}

/** Call this from a job's detail page on mount to count a view. */
export async function incrementJobView(jobId: string): Promise<void> {
  await updateDoc(doc(db, jobsCol, jobId), { viewCount: increment(1) });
}
