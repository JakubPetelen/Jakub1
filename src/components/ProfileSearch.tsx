'use client';

import { useState } from 'react';
import { searchProfiles } from '@/app/actions/profile';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LocationOn from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';

interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export default function ProfileSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedProfiles, setDisplayedProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);

  const loadProfiles = async () => {
    if (!showProfiles) {
      setIsLoading(true);
      setError(null);
      try {
        const result = await searchProfiles('');
        setDisplayedProfiles(result.profiles);
      } catch (err) {
        setError('Nastala chyba pri načítaní profilov');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await searchProfiles(searchQuery);
      setDisplayedProfiles(result.profiles);
      if (result.profiles.length === 0) {
        setError('Nenašli sa žiadni používatelia');
      }
    } catch (err) {
      setError('Nastala chyba pri načítaní profilov');
      setDisplayedProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = async () => {
    setShowProfiles(true);
    await loadProfiles();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Zadajte meno, bio alebo lokalitu..."
          variant="outlined"
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: alpha('#D32F2F', 0.7),
              },
              '&.Mui-focused fieldset': {
                borderColor: '#D32F2F',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          sx={{
            backgroundColor: '#D32F2F',
            '&:hover': {
              backgroundColor: '#D32F2F',
            },
          }}
        >
          {isLoading ? 'Načítavam...' : 'Hľadať'}
        </Button>
      </Box>

      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress sx={{ color: '#D32F2F' }} />
        </Box>
      )}

      {error && (
        <Typography 
          color="error" 
          align="center" 
          sx={{ 
            mb: 2,
            p: 2,
            bgcolor: alpha('#D32F2F', 0.1),
            borderRadius: 1
          }}
        >
          {error}
        </Typography>
      )}

      {showProfiles && !isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayedProfiles.map((profile) => (
            <Card 
              key={profile.id} 
              component={Link} 
              href={`/profil/${profile.userId}`}
              sx={{
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[4],
                  bgcolor: alpha('#D32F2F', 0.04),
                },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={profile.user.image}
                  alt={profile.user.name}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    border: '2px solid #D32F2F',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#D32F2F',
                      fontWeight: 500,
                    }}
                  >
                    {profile.user.name}
                  </Typography>
                  {profile.bio && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {profile.bio}
                    </Typography>
                  )}
                  {profile.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" sx={{ color: '#D32F2F' }} />
                      <Typography variant="body2" color="text.secondary">
                        {profile.location}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
} 