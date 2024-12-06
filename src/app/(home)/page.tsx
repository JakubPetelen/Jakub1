// src/app/(home)
"use client";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const { data: session} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/prispevok');
    }
  }, [session, router]);
  if (!session) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">Neprihlásený užívateľ</Typography>
        <Typography variant="h5">prosím prihlás sa alebo si sprav účet.</Typography>
      </Box>        
      );
  }
      
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography variant="h3" align="center">Vitaj, {session?.user?.name}</Typography>
      <Typography variant="h5" align="center">Váš email je: {session?.user?.email}</Typography>
    </Box>  
  );
    }