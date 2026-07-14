"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "@/lib/contexts/DashboardContext";
import {
  listApplicationsByApplicant,
  listApplicationsByEmployer,
  updateApplicationStatus,
} from "@/lib/firestore/applications";
import type { Application, ApplicationStatus } from "@/lib/firestore/types";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  reviewed: "bg-blue-50 text-blue-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

export default function DashboardApplicationsPage() {
  const { user, profile } = useDashboard();
  const isEmployer = profile?.role === "employer";
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = isEmployer
      ? listApplicationsByEmployer(user.uid)
      : listApplicationsByApplicant(user.uid);
    fetcher.then(setApplications).finally(() => setLoading(false));
  }, [user.uid, isEmployer]);

  async function handleStatusChange(app: Application, status: ApplicationStatus) {
    await updateApplicationStatus(app.jobId, app.applicantId, status);
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status } : a))
    );
  }

  return (
    <main className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEmployer ? "Applications received" : "My applications"}
      </h1>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-sm text-gray-500">
          {isEmployer
            ? "No one has applied to your jobs yet."
            : "You haven't applied to any jobs yet."}
        </p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-lg border border-gray-200 p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">Job ID: {app.jobId}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[app.status]}`}
                >
                  {app.status}
                </span>
              </div>

              {isEmployer && (
                <select
                  value={app.status}
                  onChange={(e) =>
                    handleStatusChange(app, e.target.value as ApplicationStatus)
                  }
                  className="rounded-md border border-gray-300 text-sm px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}