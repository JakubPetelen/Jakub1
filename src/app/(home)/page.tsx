'use client';

import { useSession } from "next-auth/react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/prispevok');
    }
  }, [status, router]);

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      textAlign="center"
      padding={3}
    >
      <Typography variant="h3" gutterBottom>
        Vitajte na ZoskaSnap!
      </Typography>
      
      {!session && (
        <Box display="flex" gap={2}>
          <Button 
            variant="contained"
            component={Link}
            href="/auth/prihlasenie"
            sx={{ backgroundColor: '#D32F2F' }}
          >
            Prihlásiť sa
          </Button>
          <Button
            variant="outlined"
            component={Link}
            href="/auth/registracia"
            sx={{ 
              borderColor: '#D32F2F',
              color: '#D32F2F'
            }}
          >
            Registrovať sa
          </Button>
        </Box>
      )}
    </Box>
  );
}
