// src/sections/SignOutView.tsx
"use client";

import { signOut } from "next-auth/react";

export default function SignOutView() {
  return (
    <div>
      <h1>Sign Out</h1>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
    </div>
  );
}
