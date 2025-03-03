'use client'

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { CircularProgress, Box } from "@mui/material"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect to login if we're trying to access a private route
    if (status === "unauthenticated" && pathname.startsWith('/(private)')) {
      router.push("/auth/prihlasenie")
    }
  }, [status, router, pathname])

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#D32F2F' }} />
      </Box>
    )
  }

  // For private routes, only show content if authenticated
  if (pathname.startsWith('/(private)')) {
    return status === "authenticated" ? <>{children}</> : null
  }

  // For public routes, always show content
  return <>{children}</>
}