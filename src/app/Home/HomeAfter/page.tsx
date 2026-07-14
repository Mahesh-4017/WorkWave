"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, MapPin, Pin, SlidersHorizontal, X } from "lucide-react";
import AutocompleteInput from "@/components/applications/Autocompleteinput";

type JobListing = {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description?: string;
    createdAt?: { seconds: number };
};

const CATEGORIES = ["Design", "Engineering", "Marketing", "Operations", "Finance", "Support"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote only"];

function daysAgo(seconds?: number) {
    if (!seconds) return null;
    const diffMs = Date.now() - seconds * 1000;
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export default function JobsSearchPage() {
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [activeCategories, setActiveCategories] = useState<string[]>([]);
    const [activeTypes, setActiveTypes] = useState<string[]>([]);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [loading, setLoading] = useState(true);

    // Live read from Firestore — updates automatically as employers post new jobs
    useEffect(() => {
        const q = query(
            collection(db, "jobs"),
            where("status", "==", "active")
        );
        const unsub = onSnapshot(
            q,
            (snap) => {
                const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as JobListing));
                data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
                setJobs(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error loading jobs:", err);
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    function toggle(list: string[], value: string, setList: (v: string[]) => void) {
        setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    }

    const filtered = jobs.filter((job) => {
        const matchesKeyword =
            !keyword ||
            job.title?.toLowerCase().includes(keyword.toLowerCase()) ||
            job.company?.toLowerCase().includes(keyword.toLowerCase());
        const matchesLocation = !location || job.location?.toLowerCase().includes(location.toLowerCase());
        const matchesType = activeTypes.length === 0 || activeTypes.includes(job.type);
        return matchesKeyword && matchesLocation && matchesType;
    });

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "#E7E0CE",
                backgroundImage: "radial-gradient(rgba(25,22,17,0.055) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* Search bar */}
            <div className="border-b-2 border-[#191611] bg-[#F4EFE2] px-6 md:px-10 py-5 sticky top-0 z-20">


                {/* Drop this in place of the old <div className="max-w-6xl mx-auto flex ..."> block. */}
                {/* Assumes two Firestore collections: "jobTitles" and "locations", each doc shaped like { name: "..." }. */}

                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-2">
                    <AutocompleteInput
                        value={keyword}
                        onChange={setKeyword}
                        collectionName="jobTitles"
                        icon={<Search className="w-4 h-4 text-[#191611]/50 shrink-0" />}
                        placeholder="Job title, keyword, or company"
                    />

                    <AutocompleteInput
                        value={location}
                        onChange={setLocation}
                        collectionName="locations"
                        icon={<MapPin className="w-4 h-4 text-[#191611]/50 shrink-0" />}
                        placeholder='City or "remote"'
                    />

                    <button className="flex items-center justify-center gap-2 bg-[#191611] text-[#F4EFE2] text-sm font-semibold px-6 py-2.5 rounded-sm hover:bg-[#2c271e] transition-colors shrink-0">
                        Search
                    </button>
                    <button
                        onClick={() => setFiltersOpen(true)}
                        className="md:hidden flex items-center justify-center gap-2 border-2 border-[#191611]/25 text-[#191611] text-sm font-semibold px-4 py-2.5 rounded-sm shrink-0"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex gap-8">
                {/* Filters sidebar */}
                <aside
                    className={`fixed inset-0 z-30 bg-[#191611]/40 md:static md:bg-transparent md:z-auto ${filtersOpen ? "block" : "hidden md:block"
                        }`}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setFiltersOpen(false);
                    }}
                >
                    <div className="w-72 h-full md:h-auto bg-[#F4EFE2] md:bg-transparent p-5 md:p-0 overflow-y-auto">
                        <div className="flex items-center justify-between md:hidden mb-4">
                            <span className="font-mono text-xs uppercase tracking-wide text-[#191611]/60">Filters</span>
                            <button onClick={() => setFiltersOpen(false)}>
                                <X className="w-5 h-5 text-[#191611]" />
                            </button>
                        </div>

                        <div
                            className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-5 mb-4"
                            style={{ boxShadow: "3px 3px 0px rgba(25,22,17,0.4)" }}
                        >
                            <h3 className="font-mono text-[11px] uppercase tracking-wide text-[#191611]/60 mb-3">
                                Category
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => toggle(activeCategories, cat, setActiveCategories)}
                                        className={`font-mono text-xs px-3 py-1.5 rounded-full border-2 transition-colors ${activeCategories.includes(cat)
                                            ? "bg-[#191611] text-[#F4EFE2] border-[#191611]"
                                            : "border-[#191611]/25 text-[#191611]/70 hover:border-[#191611]/60"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <p className="font-mono text-[10px] text-[#191611]/40 mt-2">
                                Category filtering needs a `category` field on your job docs — not wired to the query yet.
                            </p>
                        </div>

                        <div
                            className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-5"
                            style={{ boxShadow: "3px 3px 0px rgba(25,22,17,0.4)" }}
                        >
                            <h3 className="font-mono text-[11px] uppercase tracking-wide text-[#191611]/60 mb-3">
                                Job type
                            </h3>
                            <div className="space-y-2">
                                {JOB_TYPES.map((type) => (
                                    <label key={type} className="flex items-center gap-2 text-sm text-[#191611] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={activeTypes.includes(type)}
                                            onChange={() => toggle(activeTypes, type, setActiveTypes)}
                                            className="w-4 h-4 accent-[#191611]"
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Results */}
                <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs uppercase tracking-wide text-[#191611]/50 mb-4">
                        {loading ? "Loading…" : `${filtered.length} role${filtered.length !== 1 ? "s" : ""} pinned`}
                    </p>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-[#F4EFE2] border-2 border-[#191611]/30 rounded-sm p-5 h-24 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div
                            className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-10 text-center"
                            style={{ boxShadow: "4px 4px 0px rgba(25,22,17,0.4)" }}
                        >
                            <p className="text-[#191611]/60 text-sm">
                                {jobs.length === 0
                                    ? "No roles posted yet — check back soon."
                                    : "Nothing matches that search yet. Try clearing a filter."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((job) => {
                                const age = daysAgo(job.createdAt?.seconds);
                                return (
                                    <div
                                        key={job.id}
                                        className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-5 flex items-start justify-between gap-4 hover:-translate-y-0.5 transition-transform"
                                        style={{ boxShadow: "4px 4px 0px rgba(25,22,17,0.4)" }}
                                    >
                                        <div className="flex items-start gap-3 min-w-0">
                                            <Pin className="w-4 h-4 text-[#B0473F] mt-1 shrink-0" />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3
                                                        className="text-lg font-bold text-[#191611]"
                                                        style={{ fontFamily: "'Fraunces', serif" }}
                                                    >
                                                        {job.title}
                                                    </h3>
                                                    {age !== null && age <= 2 && (
                                                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#B0473F] border border-[#B0473F]/40 rounded-full px-2 py-0.5">
                                                            NEW
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-[#191611]/70">{job.company}</p>
                                                <p className="font-mono text-[11px] text-[#191611]/50 mt-1 uppercase tracking-wide">
                                                    {job.location} · {job.type}
                                                    {age !== null && ` · Posted ${age === 0 ? "today" : `${age}d ago`}`}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="shrink-0 font-mono text-xs uppercase tracking-wide bg-[#191611] text-[#F4EFE2] px-4 py-2 rounded-sm hover:bg-[#2c271e] transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}