//src/app/myprofile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Avatar, Card, CardContent, Typography, CircularProgress, TextField, Button, Snackbar, Alert } from '@mui/material';
import LocationOn from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { alpha } from '@mui/material/styles';

export default function MyProfile() {
  const { data: session, status, update } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/profile');
          if (!response.ok) {
            throw new Error('Failed to fetch profile data');
          }
          
          const data = await response.json();
          if (data.success && data.user) {
            setUsername(data.user.name || '');
            setBio(data.user.bio || '');
            setLocation(data.user.location || '');
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
          setError('Nepodarilo sa načítať profil.');
        } finally {
          setLoading(false);
        }
      } else if (status !== 'loading') {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: '#D32F2F' }} />
      </Box>
    );
  }

  if (!session) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        Nie ste prihlásený. Prosím, prihláste sa.
      </Typography>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bio, location }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Chyba pri ukladaní');
      }

      await res.json();
      
      // Update session data
      await update({ name: username }); 
      
      setIsEditing(false);
      setSuccess(true);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Nepodarilo sa uložiť zmeny.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Card
        sx={{
          textAlign: 'center',
          bgcolor: alpha('#D32F2F', 0.04),
          boxShadow: 3,
          p: 2,
        }}
      >
        <CardContent>
          <Avatar
            src={session.user?.image || '/default-avatar.png'}
            alt={username}
            sx={{ width: 80, height: 80, mx: 'auto', border: '3px solid #D32F2F' }}
          />
          {isEditing ? (
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Meno"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ my: 2 }}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                multiline
                rows={3}
                sx={{ my: 2 }}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Lokalita"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{ my: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{ bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' } }}
                >
                  Uložiť
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={() => setIsEditing(false)}
                  sx={{ borderColor: '#D32F2F', color: '#D32F2F' }}
                >
                  Zrušiť
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ color: '#D32F2F', fontWeight: 600, mt: 2 }}>
                {username}
              </Typography>
              {bio ? (
                <Typography variant="body1" sx={{ color: 'text.secondary', my: 1 }}>
                  {bio}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary', my: 1, fontStyle: 'italic' }}>
                  Žiadne bio
                </Typography>
              )}
              {location ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <LocationOn fontSize="small" sx={{ color: '#D32F2F' }} />
                  <Typography variant="body2" color="text.secondary">
                    {location}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Žiadna lokalita
                </Typography>
              )}
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                sx={{ mt: 2, borderColor: '#D32F2F', color: '#D32F2F' }}
              >
                Upraviť
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Profil bol úspešne aktualizovaný!
        </Alert>
      </Snackbar>
    </Box>
  );
}
