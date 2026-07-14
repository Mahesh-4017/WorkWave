"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AutocompleteInput({
  value,
  onChange,
  collectionName,
  field = "name",
  icon,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  /** Firestore collection to pull suggestions from, e.g. "jobTitles" or "locations" */
  collectionName: string;
  /** Field on each document holding the display text — defaults to "name" */
  field?: string;
  icon: ReactNode;
  placeholder: string;
}) {
  const [options, setOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pulled once on mount — swap getDocs for onSnapshot if you want it to update live as you add suggestions.
  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, collectionName));
        const names = snap.docs
          .map((d) => d.data()[field] as string)
          .filter(Boolean);
        setOptions(names);
      } catch (err) {
        console.error(`Error loading ${collectionName}:`, err);
      }
    }
    load();
  }, [collectionName, field]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = value
    ? options.filter((o) => o.toLowerCase().includes(value.toLowerCase()) && o.toLowerCase() !== value.toLowerCase())
    : options;

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <div className="flex items-center gap-2 border-2 border-[#191611]/25 rounded-sm px-3 py-2 bg-[#F4EFE2] focus-within:border-[#191611]">
        {icon}
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder={placeholder}
          className="w-full outline-none text-sm bg-transparent placeholder:text-[#191611]/40"
        />
      </div>

      {open && filtered.length > 0 && (
        <div
          className="absolute z-30 mt-1 w-full bg-[#F4EFE2] border-2 border-[#191611] rounded-sm overflow-hidden max-h-52 overflow-y-auto"
          style={{ boxShadow: "4px 4px 0px rgba(25,22,17,0.4)" }}
        >
          {filtered.slice(0, 8).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-[#191611] hover:bg-[#E2A73B]/15"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}