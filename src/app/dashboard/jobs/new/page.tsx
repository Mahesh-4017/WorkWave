"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Pin } from "lucide-react";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote only"];

export default function PostJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState(JOB_TYPES[0]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setFormError("You need to be signed in as an employer to post a job.");
      return;
    }
    if (!title.trim() || !company.trim() || !location.trim()) {
      setFormError("Title, company, and location are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "jobs"), {
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        type,
        description: description.trim(),
        employerId: uid,
        status: "active",
        createdAt: serverTimestamp(),
      });
      router.push("/dashboard/jobs");
    } catch (err) {
      console.error("Error posting job:", err);
      setFormError("Something went wrong posting this job. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{
        backgroundColor: "#E7E0CE",
        backgroundImage: "radial-gradient(rgba(25,22,17,0.055) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <Pin className="w-4 h-4 text-[#B0473F]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#B0473F]">
            New posting
          </span>
        </div>
        <h1
          className="text-3xl font-bold text-[#191611] mb-8"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Pin a role to the board.
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-6 space-y-4"
          style={{ boxShadow: "5px 5px 0px rgba(25,22,17,0.4)" }}
        >
          <div>
            <label htmlFor="title" className="block font-mono text-[11px] uppercase tracking-wide text-[#191611]/70 mb-1">
              Job title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Frontend Engineer"
              className="w-full rounded-sm border-2 border-[#191611]/25 bg-[#F4EFE2] px-3 py-2 text-sm outline-none focus:border-[#191611]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className="block font-mono text-[11px] uppercase tracking-wide text-[#191611]/70 mb-1">
                Company
              </label>
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company"
                className="w-full rounded-sm border-2 border-[#191611]/25 bg-[#F4EFE2] px-3 py-2 text-sm outline-none focus:border-[#191611]"
              />
            </div>
            <div>
              <label htmlFor="location" className="block font-mono text-[11px] uppercase tracking-wide text-[#191611]/70 mb-1">
                Location
              </label>
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote · IN"
                className="w-full rounded-sm border-2 border-[#191611]/25 bg-[#F4EFE2] px-3 py-2 text-sm outline-none focus:border-[#191611]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block font-mono text-[11px] uppercase tracking-wide text-[#191611]/70 mb-1">
              Job type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-sm border-2 border-[#191611]/25 bg-[#F4EFE2] px-3 py-2 text-sm outline-none focus:border-[#191611]"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block font-mono text-[11px] uppercase tracking-wide text-[#191611]/70 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="What's the role, what will they own, what do you need from them?"
              className="w-full rounded-sm border-2 border-[#191611]/25 bg-[#F4EFE2] px-3 py-2 text-sm outline-none focus:border-[#191611] resize-none"
            />
          </div>

          {formError && (
            <p className="font-mono text-xs text-[#B0473F] bg-[#B0473F]/10 border border-[#B0473F]/40 rounded-sm px-3 py-2">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-sm bg-[#191611] text-[#F4EFE2] text-sm font-semibold py-2.5 hover:bg-[#2c271e] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Posting…" : "Post job"}
          </button>
        </form>
      </div>
    </div>
  );
}