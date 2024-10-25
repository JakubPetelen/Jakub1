// src/sections/AuthHomeView.tsx
export default function AuthHomeView({ session }: { session: any }) {
    return (
      <div>
        <h1>Welcome, {session.user?.name}!</h1>
        <p>You are now signed in.</p>
      </div>
    );
  }
  