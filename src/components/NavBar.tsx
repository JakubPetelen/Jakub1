'use client';

import React, { useState, useEffect } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for night mode
import { useSession, signOut } from 'next-auth/react'; // For authentication
import { useRouter } from 'next/navigation';

// Declare that Navbar expects setDarkMode as a prop
interface NavbarProps {
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setDarkMode }) => {
  const { data: session } = useSession();
  const [value, setValue] = useState('/');
  const [darkMode, setDarkModeState] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme) {
      setDarkModeState(storedTheme === 'true');
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkModeState(newMode);
    setDarkMode(newMode);  // Update parent state
    localStorage.setItem('darkMode', newMode.toString());
  };

  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === '/auth/odhlasenie') {
      signOut({ callbackUrl: '/' });
    } else {
      router.push(newValue);
    }
  };

  const navItems = session
    ? [
        { label: 'Domov', icon: <HomeIcon />, value: '/' },
        { label: 'Hľadať', icon: <SearchIcon />, value: '/hladanie' },
        { label: 'Profily', icon: <InfoIcon />, value: '/profil' },
        { label: 'Pridať', icon: <PersonAddIcon />, value: '/pridat' },
        { label: 'Odhlásiť', icon: <LoginIcon />, value: '/auth/odhlasenie' },
      ]
    : [
        { label: 'Domov', icon: <HomeIcon />, value: '/' },
        { label: 'O mne', icon: <InfoIcon />, value: '/o-mne' },
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
          backgroundColor: darkMode ? '#333' : 'background.paper',
          '& .MuiBottomNavigationAction-root': {
            color: darkMode ? 'white' : 'text.secondary',
            '&.Mui-selected': {
              color: '#d32f2f', // Red color for selected nav items
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            value={item.value}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              fontSize: '0.75rem',
            }}
          />
        ))}
        <IconButton onClick={handleDarkModeToggle} sx={{ position: 'absolute', right: 10, top: 10 }}>
          <Brightness4Icon sx={{ color: darkMode ? 'white' : 'black' }} />
        </IconButton>
      </BottomNavigation>
    </Box>
  );
};

export default Navbar;
