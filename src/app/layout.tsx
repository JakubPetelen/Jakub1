//src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import SimpleBottomNavigation from "@/components/NavBar"; // Import the BottomNavigation component

export const metadata: Metadata = {
  title: "KuboZoska",
  description: "Created by Jakub Petelen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body>
        {children}
        <SimpleBottomNavigation /> {/* Add the BottomNavigation here */}
      </body>
    </html>
  );
}
