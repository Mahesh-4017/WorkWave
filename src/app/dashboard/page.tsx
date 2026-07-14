"use client";

import { useEffect, useMemo, useState } from "react";
import { useDashboard } from "@/lib/contexts/DashboardContext";
import {
  listApplicationsByApplicant,
  listApplicationsByEmployer,
} from "@/lib/firestore/applications";
import { listJobsByEmployer } from "@/lib/firestore/jobs";
import type { Application, ApplicationStatus, Job } from "@/lib/firestore/types";
import StatCard from "@/components/StatCard";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Pin, Briefcase, FileText } from "lucide-react";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-[#E2A73B]/15 text-[#191611] border border-[#E2A73B]/40",
  reviewed: "bg-[#5B7065]/15 text-[#3C4A42] border border-[#5B7065]/40",
  accepted: "bg-[#1E2A1F]/10 text-[#1E2A1F] border border-[#1E2A1F]/30",
  rejected: "bg-[#B0473F]/10 text-[#B0473F] border border-[#B0473F]/40",
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: "#E2A73B",
  reviewed: "#5B7065",
  accepted: "#1E2A1F",
  rejected: "#B0473F",
};

function formatDate(seconds?: number) {
  if (!seconds) return "—";
  return new Date(seconds * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardOverviewPage() {
  const { user, profile } = useDashboard();
  const isEmployer = profile?.role === "employer";

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (isEmployer) {
          const [apps, myJobs] = await Promise.all([
            listApplicationsByEmployer(user.uid),
            listJobsByEmployer(user.uid),
          ]);
          setApplications(apps);
          setJobs(myJobs);
        } else {
          const apps = await listApplicationsByApplicant(user.uid);
          setApplications(apps);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.uid, isEmployer]);

  const statusCounts = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      pending: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0,
    };
    applications.forEach((a) => {
      if (counts[a.status] !== undefined) {
        counts[a.status] += 1;
      }
    });
    return counts;
  }, [applications]);

  const chartData = (Object.keys(statusCounts) as ApplicationStatus[]).map(
    (status) => ({
      status: status[0].toUpperCase() + status.slice(1),
      count: statusCounts[status],
      fill: STATUS_COLORS[status],
    })
  );

  const sortedApplications = [...applications].sort((a, b) => {
    const aSec = a.createdAt?.seconds ?? 0;
    const bSec = b.createdAt?.seconds ?? 0;
    return bSec - aSec;
  });

  const sortedJobs = [...jobs].sort((a, b) => {
    const aSec = a.createdAt?.seconds ?? 0;
    const bSec = b.createdAt?.seconds ?? 0;
    return bSec - aSec;
  });

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#E7E0CE" }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#1E2A1F] flex items-center justify-center animate-pulse">
            <Pin className="w-5 h-5 text-[#E2A73B]" />
          </span>
          <p className="font-mono text-xs uppercase tracking-widest text-[#191611]/60">
            Pulling your data…
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="p-8 max-w-6xl min-h-screen"
      style={{
        backgroundColor: "#E7E0CE",
        backgroundImage: "radial-gradient(rgba(25,22,17,0.055) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#B0473F] mb-1">
        Dashboard
      </p>
      <h1
        className="text-3xl font-bold text-[#191611] mb-8"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {isEmployer ? "Employer overview" : "Your overview"}
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {isEmployer ? (
          <>
            <StatCard label="Jobs posted" value={jobs.length} />
            <StatCard label="Total applications" value={applications.length} />
            <StatCard label="Pending review" value={statusCounts.pending} />
            <StatCard label="Accepted" value={statusCounts.accepted} />
          </>
        ) : (
          <>
            <StatCard label="Applications sent" value={applications.length} />
            <StatCard label="Pending" value={statusCounts.pending} />
            <StatCard label="Reviewed" value={statusCounts.reviewed} />
            <StatCard label="Accepted" value={statusCounts.accepted} />
          </>
        )}
      </div>

      {/* Status breakdown chart */}
      <div
        className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-5 mb-8"
        style={{ boxShadow: "4px 4px 0px rgba(25,22,17,0.4)" }}
      >
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-[#191611]/60 mb-4">
          Applications by status
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#19161120" />
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: "#191611" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#191611" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F4EFE2",
                  border: "2px solid #191611",
                  borderRadius: 2,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`grid gap-8 ${isEmployer ? "md:grid-cols-2" : ""}`}>
        {/* Jobs list — employer only, pulled straight from your `jobs` collection */}
        {isEmployer && (
          <div
            className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-5"
            style={{ boxShadow: "4px 4px 0px rgba(25,22,17,0.4)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-[#B0473F]" />
              <h2 className="font-mono text-[11px] uppercase tracking-wide text-[#191611]/60">
                Your jobs ({sortedJobs.length})
              </h2>
            </div>
            {sortedJobs.length === 0 ? (
              <p className="text-sm text-[#191611]/50">No jobs posted yet.</p>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {sortedJobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex items-start justify-between gap-3 border-b border-[#191611]/20 pb-2 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#191611] truncate">
                        {job.title ?? "Untitled role"}
                      </p>
                      <p className="font-mono text-[11px] text-[#191611]/50">
                        {job.location ?? "—"} · Posted {formatDate(job.createdAt?.seconds)}
                      </p>
                    </div>
                    {job.status && (
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#1E2A1F]/10 text-[#1E2A1F]">
                        {job.status}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Applications list — all applications, not just the last 5 */}
        <div
          className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-5"
          style={{ boxShadow: "4px 4px 0px rgba(25,22,17,0.4)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-[#B0473F]" />
            <h2 className="font-mono text-[11px] uppercase tracking-wide text-[#191611]/60">
              All applications ({sortedApplications.length})
            </h2>
          </div>
          {sortedApplications.length === 0 ? (
            <p className="text-sm text-[#191611]/50">No applications yet.</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-[#191611]/15">
                    <th className="py-2 font-mono text-[10px] uppercase tracking-wide text-[#191611]/50">
                      Job ID
                    </th>
                    <th className="py-2 font-mono text-[10px] uppercase tracking-wide text-[#191611]/50">
                      Applied
                    </th>
                    <th className="py-2 font-mono text-[10px] uppercase tracking-wide text-[#191611]/50">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedApplications.map((app) => (
                    <tr key={app.id} className="border-b border-[#191611]/10 last:border-0">
                      <td className="py-2 text-[#191611] truncate max-w-[120px]">{app.jobId}</td>
                      <td className="py-2 font-mono text-[11px] text-[#191611]/60">
                        {formatDate(app.createdAt?.seconds)}
                      </td>
                      <td className="py-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[app.status]}`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}