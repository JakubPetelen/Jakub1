// src/components/NavBar.tsx

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SimpleBottomNavigation() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
      <BottomNavigation>
        <BottomNavigationAction
          label="Domov"
          icon={<HomeIcon />}
          onClick={() => router.push('/')}
        />
        <BottomNavigationAction
          label="Hľadať"
          icon={<AccountCircleIcon />}
          onClick={() => router.push('/hladat')}
        />
        <BottomNavigationAction
          label="Pridať"
          icon={<AddCircleIcon />}
          onClick={() => router.push('/pridat')}
        />
        {session ? (
          <BottomNavigationAction
            label="Odhlásiť"
            icon={<ExitToAppIcon />}
            onClick={() => {
              signOut(); // Sign out the user
              router.push('/'); // Optionally redirect to home after signing out
            }}
          />
        ) : (
          <BottomNavigationAction
            label="Prihlásiť sa"
            icon={<ExitToAppIcon />}
            onClick={() => router.push('/auth/prihlasenie')}
          />
        )}
        {!session && (
          <BottomNavigationAction
            label="Registrácia"
            icon={<AppRegistrationIcon />}
            onClick={() => router.push('/auth/registracia')}
          />
        )}
      </BottomNavigation>
    </Box>
  );
}
