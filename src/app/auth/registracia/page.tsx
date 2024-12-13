'use client';

import React, { useState } from 'react';
import { Button, Typography, Box, Link as MuiLink, Checkbox, FormControlLabel } from '@mui/material';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const [gdprAgreed, setGdprAgreed] = useState(false);

  const handleGoogleSignUp = () => {
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
          Vitajte na Registrovacej stránke
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Ak už máte účet,{' '}
          <MuiLink
            component="button"
            variant="body1"
            onClick={handleGoogleSignUp}
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
          {' '}na prihlásenie.
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
          sx={{ marginBottom: 2 }}
        />

        <Button
          variant="contained"
          color="error"
          onClick={handleGoogleSignUp}
          sx={{
            marginTop: 2,
            borderRadius: '8px',
            opacity: gdprAgreed ? 1 : 0.3, // Low opacity when GDPR is not agreed
            pointerEvents: gdprAgreed ? 'auto' : 'none', // Disable button when GDPR is not agreed
          }}
        >
          Registrovať sa pomocou Google
        </Button>
      </Box>
    </Box>
  );
}
