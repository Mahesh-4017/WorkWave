"use client";

type TwitterButtonProps = {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
};

export default function TwitterButton({
    onClick,
    disabled,
    label = "Continue with X",
}: TwitterButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {label}
        </button>
    );
}