// src/sections/SignUpView.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpView() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page if already signed up (authenticated)
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <button onClick={() => signIn("google")}>Sign up with Google</button>
    </div>
  );
}
