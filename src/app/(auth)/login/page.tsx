"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, signInWithApple, signInWithGoogle, signInWithTwitter } from "@/lib/firebase/auth";
import { validateLoginForm, type FieldErrors } from "@/lib/validation";
import AppleButton from "@/components/auth/Applebutton";
import GoogleButton from "@/components/auth/Googlebutton";
import TwitterButton from "@/components/auth/Twitterbutton";
import { Pin } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isTwitterSubmitting, setIsTwitterSubmitting] = useState(false);
  const [isAppleSubmitting, setIsAppleSubmitting] = useState(false);

  async function handleGoogleSignIn() {
    setFormError(null);
    setIsGoogleSubmitting(true);
    const { user, error } = await signInWithGoogle();
    setIsGoogleSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }
    if (user) {
      router.push("/");
    }
  }

  async function handleTwitterSignIn() {
    setFormError(null);
    setIsTwitterSubmitting(true);
    const { user, error } = await signInWithTwitter();
    setIsTwitterSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }
    if (user) {
      router.push("/");
    }
  }

  async function handleAppleSignIn() {
    setFormError(null);
    setIsAppleSubmitting(true);
    const { user, error } = await signInWithApple();
    setIsAppleSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }
    if (user) {
      router.push("/");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const validationErrors = validateLoginForm(email, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const { user, error } = await loginWithEmail(email, password);
    setIsSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }
    if (user) {
      router.push("/");
    }
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "#E7E0CE",
        backgroundImage: "radial-gradient(rgba(25,22,17,0.055) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Left panel — brand / welcome */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#1E2A1F] items-center justify-center overflow-visible">
        <div className="text-center px-12 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#F4EFE2] flex items-center justify-center mx-auto mb-6">
            <Pin className="w-7 h-7 text-[#B0473F]" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#E2A73B] mb-2">
            Welcome to
          </p>
          <h1
            className="text-4xl font-bold text-[#F4EFE2] mb-6"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            POSTED
          </h1>
          <p className="text-sm text-[#F4EFE2]/60 leading-relaxed">
            No feeds, no algorithms guessing what you want. Just roles,
            posted plainly — sign in to pick up where you left off.
          </p>
        </div>

        {/* scalloped edge — column of circles bleeding into the right panel */}
        <div className="absolute top-0 -right-4 h-full w-8 flex flex-col justify-between py-2 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-5 h-8 rounded-full bg-[#1E2A1F] shrink-0" />
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="md:hidden text-center mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#B0473F] mb-1">
              Welcome to
            </p>
            <h1
              className="text-3xl font-bold text-[#191611]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              POSTED
            </h1>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#191611]/50">
              Sign in
            </span>
          </div>
          <h2
            className="text-3xl font-bold text-[#191611] mb-6"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Good to see you.
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[11px] uppercase tracking-wide text-[#191611]/70 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-sm border-2 bg-[#F4EFE2] px-3 py-2 text-sm outline-none transition-colors ${errors.email
                  ? "border-[#B0473F] focus:border-[#B0473F]"
                  : "border-[#191611]/25 focus:border-[#191611]"
                  }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 font-mono text-xs text-[#B0473F]">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block font-mono text-[11px] uppercase tracking-wide text-[#191611]/70"
                >
                  Password
                </label>
                <Link
                  href="/reset"
                  className="text-xs text-[#B0473F] hover:underline font-mono"
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-sm border-2 bg-[#F4EFE2] px-3 py-2 text-sm outline-none transition-colors ${errors.password
                  ? "border-[#B0473F] focus:border-[#B0473F]"
                  : "border-[#191611]/25 focus:border-[#191611]"
                  }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 font-mono text-xs text-[#B0473F]">{errors.password}</p>
              )}
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
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[#191611]/15" />
            <span className="font-mono text-[10px] uppercase tracking-wide text-[#191611]/40">
              or
            </span>
            <div className="h-px flex-1 bg-[#191611]/15" />
          </div>

          <div className="space-y-2">
            <GoogleButton
              onClick={handleGoogleSignIn}
              disabled={isGoogleSubmitting}
              label={isGoogleSubmitting ? "Signing in..." : "Continue with Google"}
            />
            <TwitterButton
              onClick={handleTwitterSignIn}
              disabled={isTwitterSubmitting}
              label={isTwitterSubmitting ? "Signing in..." : "Continue with X"}
            />
            <AppleButton
              onClick={handleAppleSignIn}
              disabled={isAppleSubmitting}
              label={isAppleSubmitting ? "Signing in..." : "Continue with Apple"}
            />
          </div>

          <p className="mt-6 text-center font-mono text-xs text-[#191611]/60">
            No account yet?{" "}
            <Link href="/signup" className="text-[#B0473F] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}