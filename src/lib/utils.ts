// Utility helpers (e.g. cn for Tailwind merge)
export function cn(...inputs: unknown[]) {
  return inputs.filter(Boolean).join(' ');
}
