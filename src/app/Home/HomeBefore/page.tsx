"use client";

import { Search, MapPin, ArrowRight, Pin } from "lucide-react";

const FONT_IMPORT_NOTE = `
  Add to your project (globals.css or next/font):
  Fraunces (display serif) — headline
  Inter (body)
  IBM Plex Mono (eyebrows / stamped data)
`;

const listings = [
  {
    role: "Product Designer",
    company: "Loom & Co.",
    location: "Remote · IN",
    tag: "NEW",
    rotate: "-rotate-3",
    tape: "left-6",
  },
  {
    role: "Frontend Engineer",
    company: "Northline Labs",
    location: "Bengaluru",
    tag: "URGENT",
    rotate: "rotate-2",
    tape: "right-8",
  },
  {
    role: "Ops Associate",
    company: "Ferry & Finch",
    location: "Hybrid",
    tag: "",
    rotate: "-rotate-1",
    tape: "left-10",
  },
];

const categories = [
  "Design",
  "Engineering",
  "Marketing",
  "Operations",
  "Finance",
  "Support",
  "Remote only",
];

export default function HomeLanding() {
  return (
    <div
      className="min-h-screen flex flex-col text-[#191611]"
      style={{
        backgroundColor: "#E7E0CE",
        backgroundImage:
          "radial-gradient(rgba(25,22,17,0.055) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      

      {/* Hero */}
      <main className="flex-1 px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: copy + search */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#B0473F] mb-4">
              — Est. every Monday, freshly pinned
            </p>
            <h1
              className="text-5xl md:text-6xl leading-[1.05] font-bold mb-6"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Pin your next
              <br />
              chapter to the
              <br />
              board.
            </h1>
            <p className="text-[#191611]/70 text-base mb-8 max-w-md">
              No feeds, no algorithms guessing what you want. Just roles,
              posted plainly, the way a board in a real hallway used to work.
            </p>

            {/* Search styled as a folder tab card */}
            <div className="relative max-w-lg">
              <div className="absolute -top-3 left-6 bg-[#191611] text-[#F4EFE2] text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-t-sm">
                Search the board
              </div>
              <div
                className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-3 flex flex-col sm:flex-row gap-2"
                style={{ boxShadow: "5px 5px 0px #191611" }}
              >
                <div className="flex items-center gap-2 flex-1 px-3 py-2 border-b sm:border-b-0 sm:border-r border-[#191611]/20">
                  <Search className="w-4 h-4 text-[#191611]/50 shrink-0" />
                  <input
                    type="text"
                    placeholder="Role or keyword"
                    className="w-full outline-none text-sm bg-transparent placeholder:text-[#191611]/40"
                  />
                </div>
                <div className="flex items-center gap-2 flex-1 px-3 py-2">
                  <MapPin className="w-4 h-4 text-[#191611]/50 shrink-0" />
                  <input
                    type="text"
                    placeholder="City or “remote”"
                    className="w-full outline-none text-sm bg-transparent placeholder:text-[#191611]/40"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 bg-[#191611] text-[#F4EFE2] text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-[#2c271e] transition-colors shrink-0">
                  Search <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="font-mono text-xs text-[#191611]/50 mt-5 tracking-wide">
              12,480 roles currently pinned · 340 added this week
            </p>
          </div>

          {/* Right: pinned card cluster */}
          <div className="relative h-[420px] hidden md:block">
            {/* dashed thread connecting cards */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 420"
              fill="none"
            >
              <path
                d="M60 90 C 150 60, 180 160, 260 140 S 340 260, 300 330"
                stroke="#B0473F"
                strokeWidth="2"
                strokeDasharray="6 6"
                opacity="0.6"
              />
            </svg>

            {listings.map((job, i) => (
              <div
                key={job.role}
                className={`absolute ${job.rotate} bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-5 w-64 hover:rotate-0 hover:scale-[1.03] transition-transform duration-200`}
                style={{
                  boxShadow: "4px 4px 0px rgba(25,22,17,0.5)",
                  top: `${i * 130}px`,
                  left: i % 2 === 0 ? "0px" : "120px",
                }}
              >
                {/* washi tape */}
                <div
                  className={`absolute -top-3 ${job.tape} w-14 h-5 bg-[#E2A73B]/70 rotate-[-4deg]`}
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                />
                <div className="flex items-start justify-between mb-2">
                  <Pin className="w-4 h-4 text-[#B0473F]" />
                  {job.tag && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#B0473F] border border-[#B0473F]/40 rounded-full px-2 py-0.5">
                      {job.tag}
                    </span>
                  )}
                </div>
                <h3
                  className="text-lg font-bold leading-snug mb-1"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {job.role}
                </h3>
                <p className="text-sm text-[#191611]/70">{job.company}</p>
                <p className="font-mono text-[11px] text-[#191611]/50 mt-2 uppercase tracking-wide">
                  {job.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category tags */}
        <div className="mt-24 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              className="font-mono text-xs uppercase tracking-wide px-4 py-2 border-2 border-[#191611] rounded-full hover:bg-[#191611] hover:text-[#F4EFE2] transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </main>

     
    </div>
  );
}