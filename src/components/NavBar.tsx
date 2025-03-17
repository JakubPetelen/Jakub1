'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  BottomNavigation, 
  BottomNavigationAction, 
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setDarkMode }) => {
  const { data: session } = useSession();
  const [value, setValue] = useState('/');
  const [darkMode, setDarkModeState] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileAction = (action: 'profile' | 'saved-posts' | 'logout') => {
    handleMenuClose();
    if (action === 'profile') {
      router.push('/myprofile');
    } else if (action === 'saved-posts') {
      router.push('/saved-posts');
    } else {
      signOut({ callbackUrl: '/' });
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme) {
      setDarkModeState(storedTheme === 'true');
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkModeState(newMode);
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'profile-menu') {
      return; // Don't update value or navigate for profile menu
    }
    setValue(newValue);
    router.push(newValue);
  };

  const navItems = session
    ? [
        { label: 'Domov', icon: <HomeIcon />, value: '/' },
        { label: 'Hľadať', icon: <SearchIcon />, value: '/hladanie' },
        { label: 'Pridať', icon: <PersonAddIcon />, value: '/pridat' },
        { 
          label: 'Môj profil', 
          icon: <PersonIcon />, 
          value: 'profile-menu',
          onClick: handleProfileClick 
        },
      ]
    : [
        { label: 'Domov', icon: <HomeIcon />, value: '/' },
        { label: 'O mne', icon: <PersonIcon />, value: '/o-mne' },
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
              color: '#d32f2f',
            },
          },
        }}
      >
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            sx: {
              mt: -7,
              '& .MuiMenuItem-root': {
                py: 1.5,
                px: 2.5,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem onClick={() => handleProfileAction('profile')}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" sx={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText>Môj profil</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleProfileAction('saved-posts')}>
            <ListItemIcon>
              <BookmarkIcon fontSize="small" sx={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText>Uložené príspevky</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleProfileAction('logout')}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText>Odhlásiť sa</ListItemText>
          </MenuItem>
        </Menu>
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            value={item.value}
            onClick={item.onClick}
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
