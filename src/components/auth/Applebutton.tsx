"use client";

type AppleButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export default function AppleButton({
  onClick,
  disabled,
  label = "Continue with Apple",
}: AppleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-black text-sm font-medium py-2 text-white hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 384 512" aria-hidden="true" fill="currentColor">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37.1 59 128 107.2 126.5 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-83.5 102.6-120.7-65.2-30.7-61.7-90-61.7-91.8zM255.7 88.9c26.9-32 24.5-61.2 23.7-71.9-23.8 1.4-51.4 16.4-67.1 34.9-17.3 19.6-27.5 44-25.3 71.4 26.2 2 50-11.1 68.7-34.4z" />
      </svg>
      {label}
    </button>
  );
}