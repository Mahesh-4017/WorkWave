export default function Footer() {
  return (
      <footer className="border-t-4 border-[#191611] px-6 md:px-10 py-8" style={{ backgroundColor: "#1E2A1F" }}>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-[#F4EFE2]/80 mb-6 font-mono uppercase tracking-wide text-xs">
          <div className="flex flex-col gap-2">
            <span className="text-[#E2A73B] mb-1">Board</span>
            <a href="#" className="hover:text-[#E2A73B]">Browse roles</a>
            <a href="#" className="hover:text-[#E2A73B]">Companies</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#E2A73B] mb-1">Notes</span>
            <a href="#" className="hover:text-[#E2A73B]">Salary guide</a>
            <a href="#" className="hover:text-[#E2A73B]">Career advice</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#E2A73B] mb-1">For teams</span>
            <a href="#" className="hover:text-[#E2A73B]">Post a role</a>
            <a href="#" className="hover:text-[#E2A73B]">Pricing</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#E2A73B] mb-1">Studio</span>
            <a href="#" className="hover:text-[#E2A73B]">About</a>
            <a href="#" className="hover:text-[#E2A73B]">Help</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F4EFE2]/15 text-[11px] font-mono text-[#F4EFE2]/50 uppercase tracking-wide">
          <span>© 2026 Posted — pinned daily</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#E2A73B]">Privacy</a>
            <a href="#" className="hover:text-[#E2A73B]">Terms</a>
          </div>
        </div>
      </footer>
  );
}
