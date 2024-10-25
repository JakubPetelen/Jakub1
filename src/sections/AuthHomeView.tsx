// src/sections/AuthHomeView.tsx
import { Session } from "next-auth"; // Import the Session type

export default function AuthHomeView({ session }: { session: Session }) {
    return (
        <div>
            <h1>Welcome, {session.user?.name}!</h1>
            <p>You are now signed in.</p>
        </div>
    );
}
