'use client';

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Link as MuiLink, Checkbox, FormControlLabel } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [gdprAgreed, setGdprAgreed] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/prispevok');
      router.refresh();
    }
  }, [status, router]);

  const handleGoogleSignUp = () => {
    if (!gdprAgreed) {
      alert('Musíte súhlasiť s GDPR podmienkami.');
      return;
    }
    signIn('google', {
      callbackUrl: '/prispevok',
      redirect: true
    });
  };

  if (status === 'authenticated') {
    return null;
  }

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
            onClick={() => router.push('/auth/prihlasenie')}
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
              <MuiLink href="/gdpr" target="_self" sx={{ textDecoration: 'underline', color: 'red' }}>
                GDPR podmienkami
              </MuiLink>
            </Typography>
          }
          sx={{ marginBottom: 2 }}
        />

        {/* Button is always red, no opacity changes */}
        <Button
          variant="contained"
          color="error" // Always red
          onClick={handleGoogleSignUp}
          sx={{
            marginTop: 2,
            borderRadius: '8px',
          }}
        >
          Registrovať sa pomocou Google
        </Button>
      </Box>
    </Box>
  );
}
