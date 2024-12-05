'use client';

import React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import GavelIcon from '@mui/icons-material/Gavel';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { useSession, signOut } from 'next-auth/react'; // Added `signOut` for logout
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const [value, setValue] = React.useState('/');
  const router = useRouter();

  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);

    // Custom handling for Logout
    if (newValue === '/auth/odhlasenie') {
      signOut(); // Triggers the logout flow
    } else {
      router.push(newValue); // Navigate to the selected route
    }
  };

  // Navigation items
  const navItems = session
    ? [
        { label: 'Domov', icon: <HomeIcon />, value: '/' },
        { label: 'Hľadať', icon: <SearchIcon />, value: '/hladanie' },
        { label: 'Profily', icon: <PersonIcon />, value: '/profil' },
        { label: 'Pridať', icon: <AddIcon />, value: '/pridat' },
        { label: 'Odhlásiť', icon: <LogoutIcon />, value: '/auth/odhlasenie' },
      ]
    : [
        { label: 'Domov', icon: <HomeIcon />, value: '/' },
        { label: 'O mne', icon: <InfoIcon />, value: '/o-mne' },
        { label: 'GDPR', icon: <GavelIcon />, value: '/gdpr' },
        { label: 'Prihlásenie', icon: <LoginIcon />, value: '/auth/prihlasenie' },
        { label: 'Registrácia', icon: <PersonAddIcon />, value: '/auth/registracia' },
      ];

  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleNavigation}
        sx={{
          backgroundColor: 'background.paper',
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            value={item.value} // Ensure each item has a `value`
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              fontSize: '0.75rem',
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}