"use client";

type GoogleButtonProps = {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
};

export default function GoogleButton({
    onClick,
    disabled,
    label = "Continue with Google",
}: GoogleButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                    fill="#FF3D00"
                    d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z"
                />
                <path
                    fill="#4CAF50"
                    d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5C29.4 34.6 26.8 35.5 24 35.5c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5c3.6 6.5 10.1 11 17.8 11z"
                />
                <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5v.1l6.5 5.5C37.9 39.5 44 34 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
            </svg>
            {label}
        </button>
    );
}