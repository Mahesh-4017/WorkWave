export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="bg-[#F4EFE2] border-2 border-[#191611] rounded-sm p-4"
      style={{ boxShadow: "3px 3px 0px rgba(25,22,17,0.4)" }}
    >
      <p className="font-mono text-[10px] uppercase tracking-wide text-[#191611]/60">
        {label}
      </p>
      <p
        className="text-3xl font-bold text-[#191611] mt-1"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {value}
      </p>
    </div>
  );
}