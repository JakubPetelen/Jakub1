'use client';

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/prispevok");
    }
  }, [session, router]);

  if (!session) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h3" gutterBottom>Vitajte na ZoskaSnap!</Typography>
        <Typography variant="h5" color="textSecondary" mb={3}>
          Prosím, prihláste sa alebo si vytvorte účet, aby ste mohli pokračovať.
        </Typography>
        <Button 
          variant="contained" 
          color="error" // Red color
          component={Link} 
          href="/api/auth/signin"
        >
          Prihlásiť sa
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      textAlign="center"
    >
      <Typography variant="h3" gutterBottom>
        Vitaj, {session?.user?.name}!
      </Typography>
      <Typography variant="h5" color="textSecondary" mb={2}>
        Tešíme sa, že ste tu. Preskúmajte nové príspevky a zapojte sa do komunity!
      </Typography>
      <Button 
        variant="contained" 
        color="error" // Red color
        component={Link} 
        href="/prispevok"
      >
        Prejsť na príspevky
      </Button>
    </Box>
  );
}
