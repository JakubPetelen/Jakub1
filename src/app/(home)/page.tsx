// src/app/(home)/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import AuthHomeView from "@/sections/AuthHomeView";
import NonAuthHomeView from "@/sections/NonAuthHomeView";

export const metadata = { title: "Domov | ZoškaSnap" };

export default async function HomePage() {
  try {
    // Fetch the session using getServerSession for server-side rendering
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session) {
      // If not authenticated, render the NonAuthHomeView
      return <NonAuthHomeView />;
    }

    // If authenticated, render the AuthHomeView with the session data
    return <AuthHomeView session={session} />;
  } catch (error) {
    // Handle any errors while fetching the session
    console.error("Error fetching session:", error);
    return <NonAuthHomeView />;
  }
}
