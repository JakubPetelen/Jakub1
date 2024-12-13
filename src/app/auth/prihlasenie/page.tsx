'use client';

import React, { useState } from 'react';
import { Button, Typography, Box, Link as MuiLink, Checkbox, FormControlLabel } from '@mui/material';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  const [gdprAgreed, setGdprAgreed] = useState(false);

  const handleGoogleSignIn = () => {
    if (!gdprAgreed) {
      alert('Musíte súhlasiť s GDPR podmienkami.');
      return;
    }
    signIn('google'); // Use Google authentication
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: 3,
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Vitajte na Prihlasovacej stránke
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Prihláste sa pomocou Google kliknutím na tlačidlo nižšie alebo{' '}
          <MuiLink
            component="button"
            variant="body1"
            onClick={handleGoogleSignIn}
            sx={{
              color: 'red',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                color: '#d32f2f',
              },
            }}
          >
            kliknite sem
          </MuiLink>
          .
        </Typography>

        {/* GDPR Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={gdprAgreed}
              onChange={(e) => setGdprAgreed(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              Súhlasím s{' '}
              <MuiLink href="/gdpr" target="_blank" sx={{ textDecoration: 'underline', color: 'red' }}>
                GDPR podmienkami
              </MuiLink>
            </Typography>
          }
        />

        <Button
          variant="contained"
          color="error"
          onClick={handleGoogleSignIn}
          sx={{
            marginTop: 2,
            borderRadius: '8px',
            opacity: gdprAgreed ? 1 : 0.3, // Low opacity when GDPR is not agreed
            pointerEvents: gdprAgreed ? 'auto' : 'none', // Disable button when GDPR is not agreed
          }}
        >
          Prihlásiť sa pomocou Google
        </Button>
      </Box>
    </Box>
  );
}
