"use client";

import { signIn } from "next-auth/react";
import { DSButton } from "@/components/";

export default function LoginPage() {
  const handleDiscordLogin = () => {
    signIn("discord", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-neutral-500">
            Sign in with your Discord account to continue
          </p>
        </div>

        <DSButton
          onClick={handleDiscordLogin}
          className="w-full flex items-center justify-center gap-2 text-white py-6"
        >
          Sign In with Discord
        </DSButton>
      </div>
    </div>
  );
}
