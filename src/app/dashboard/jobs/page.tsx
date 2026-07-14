"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/lib/contexts/DashboardContext";
import { listJobsByEmployer } from "@/lib/firestore/jobs";
import type { Job } from "@/lib/firestore/types";

export default function DashboardJobsPage() {
  const { user } = useDashboard();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listJobsByEmployer(user.uid)
      .then(setJobs)
      .finally(() => setLoading(false));
  }, [user.uid]);

  return (
    <main className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My jobs</h1>
        <Link
          href="/dashboard/jobs/new"
          className="rounded-md bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Post a job
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-sm text-gray-500">You haven&apos;t posted any jobs yet.</p>
      ) : (
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="py-2 px-4 font-medium">Title</th>
              <th className="py-2 px-4 font-medium">Location</th>
              <th className="py-2 px-4 font-medium">Applications</th>
              <th className="py-2 px-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-gray-100">
                <td className="py-2 px-4 font-medium">{job.title}</td>
                <td className="py-2 px-4 text-gray-600">{job.location ?? "—"}</td>
                <td className="py-2 px-4 text-gray-600">{job.applicantCount ?? 0}</td>
                <td className="py-2 px-4 text-right">
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
