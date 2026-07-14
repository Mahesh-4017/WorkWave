export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white p-4">Seeker Navigation Header</header>
      <main className="p-6">{children}</main>
    </div>
  );
}
