"use client";

import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SigninError = {
  email?: string;
  password?: string;
};

export default function Signin() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<SigninError>({});
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    try {
      setLoading(true);
      setError({});

      const res = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // Field validation errors
      if (!data.success && data.errors?.fieldErrors) {
        const formatted: SigninError = {};

        Object.keys(data.errors.fieldErrors).forEach((key) => {
          formatted[key as keyof SigninError] =
            data.errors.fieldErrors[key]?.[0];
        });

        setError(formatted);
        return;
      }

      // User not found → redirect to signup
      if (!data.success && data.errorCode === "USER_NOT_FOUND") {
        router.push("/auth/signup");
        return;
      }

      // Redirect based on role
      if (data.success) {
        if (data.data.role === Role.ADMIN) {
          router.push("/admin-dashboard");
        } else {
          router.push("/user-dashboard");
        }
      }
    } catch (err) {
      console.error("Signin error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96 space-y-6">
        
        <h1 className="text-2xl font-semibold text-center">
          Sign In
        </h1>

        {/* Email */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setError((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {error.email && (
            <span className="text-red-500 text-sm">
              {error.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setError((prev) => ({ ...prev, password: undefined }));
            }}
          />
          {error.password && (
            <span className="text-red-500 text-sm">
              {error.password}
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleSignin}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
