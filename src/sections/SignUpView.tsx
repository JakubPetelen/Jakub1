//src\sections\SignInView.tsx

"use client";

import { signIn } from "next-auth/react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';

export default function SignInView() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", height:"100%", bgcolor:"#ebebeb", padding:"4%", gap:2, borderRadius:"5px"}}>
        <Typography variant="h5"><strong>Registrovať sa</strong></Typography>
        <Button variant='contained' startIcon={<GoogleIcon />} onClick={() => signIn("google")}>Registrovať sa pomocou Google</Button>
      </Box>
      
    </Box>
  );
}