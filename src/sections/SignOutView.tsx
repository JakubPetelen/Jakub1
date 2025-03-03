// src\sections\SignOutView.tsx
'use client';

import { signOut }  from "next-auth/react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// export const metadata = { title: 'Odhlásiť sa | KamNaKavu'};

export default function SignOutView() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", height:"100%", bgcolor:"#ebebeb", padding:"4%", gap:2, borderRadius:"5px"}}>
        <Typography variant="h5"><strong>Naozaj sa chcete odhlásiť?</strong></Typography>
        <Button 
          variant='contained' 
          startIcon={<ExitToAppIcon />} 
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Odhlásiť sa
        </Button>
      </Box>
    </Box>
  );
}