'use client';

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Link as MuiLink, Checkbox, FormControlLabel } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [gdprAgreed, setGdprAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/prispevok');
      router.refresh();
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    if (!gdprAgreed) {
      setError('Musíte súhlasiť s GDPR podmienkami.');
      return;
    }
    setError(null);
    try {
      await signIn('google', {
        callbackUrl: '/prispevok',
        redirect: true
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
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
          Vitajte na Prihlasovacej stránke
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Ak nemáte účet,{' '}
          <MuiLink
            component="button"
            variant="body1"
            onClick={() => router.push('/auth/registracia')}
            sx={{
              color: '#D32F2F',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                color: '#D32F2F',
              },
            }}
          >
            kliknite sem
          </MuiLink>
          {' '}na registráciu.
        </Typography>

        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mb: 2,
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              padding: '8px 16px',
              borderRadius: '4px',
              width: '100%'
            }}
          >
            {error}
          </Typography>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={gdprAgreed}
              onChange={(e) => {
                setGdprAgreed(e.target.checked);
                setError(null);
              }}
              color="primary"
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              Súhlasím s{' '}
              <MuiLink href="/gdpr" target="_self" sx={{ textDecoration: 'underline', color: '#D32F2F' }}>
                GDPR podmienkami
              </MuiLink>
            </Typography>
          }
          sx={{ marginBottom: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleGoogleSignIn}
          sx={{
            backgroundColor: '#D32F2F',
            color: 'white',
            '&:hover': {
              backgroundColor: '#D32F2F',
            },
            marginTop: 2,
            borderRadius: '8px',
          }}
        >
          Prihlásiť sa cez Google
        </Button>
      </Box>
    </Box>
  );
}
