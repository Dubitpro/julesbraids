"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/src/lib/validation/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/src/lib/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setAuthError(null);
    try {
      await signUpWithEmail(data.email, data.password, data.firstName, data.lastName);
      router.push("/account");
    } catch (err: any) {
      console.error("Registration failed:", err);
      if (err.code === "auth/email-already-in-use") {
        setAuthError("This email address is already registered. Please sign in instead.");
      } else if (err.code === "auth/weak-password") {
        setAuthError("Password should be at least 6 characters.");
      } else {
        setAuthError(err.message || "Failed to create account. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
      router.push("/account");
    } catch (err: any) {
      console.error("Google sign up failed:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setAuthError(err.message || "Google registration could not be completed.");
      }
    }
  };

  return (
    <div className="bg-warm-white min-h-screen flex items-center justify-center py-24 px-6">
      <div className="w-full max-w-md bg-white p-8 border border-taupe/20 shadow-xs">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-obsidian tracking-tight mb-2">Create Account</h1>
          <p className="text-sm text-taupe">Join Julesbraids and Hair for saved orders and seamless tracking.</p>
        </div>

        {authError && (
          <div className="mb-6 p-3.5 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">First Name</label>
              <input
                type="text"
                {...register("firstName")}
                className="block w-full rounded-sm border-0 py-2.5 px-3 text-obsidian ring-1 ring-inset ring-taupe/30 focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
                placeholder="Jane"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                className="block w-full rounded-sm border-0 py-2.5 px-3 text-obsidian ring-1 ring-inset ring-taupe/30 focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
                placeholder="Doe"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">Email Address</label>
            <input
              type="email"
              {...register("email")}
              className="block w-full rounded-sm border-0 py-2.5 px-3 text-obsidian ring-1 ring-inset ring-taupe/30 focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">Password</label>
            <input
              type="password"
              {...register("password")}
              className="block w-full rounded-sm border-0 py-2.5 px-3 text-obsidian ring-1 ring-inset ring-taupe/30 focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-3.5 bg-obsidian text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-taupe/20" />
          <span className="text-[11px] uppercase tracking-wider text-taupe">or continue with</span>
          <div className="flex-1 h-px bg-taupe/20" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-6 w-full flex items-center justify-center gap-2.5 py-3 border border-taupe/20 bg-white hover:bg-warm-white text-xs font-semibold uppercase tracking-wider text-charcoal transition"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          Google
        </button>

        <div className="mt-8 text-center pt-6 border-t border-taupe/10">
          <p className="text-xs text-taupe mb-3">Already have an account?</p>
          <Link
            href="/login"
            className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-obsidian hover:text-champagne transition-colors"
          >
            Sign In <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
