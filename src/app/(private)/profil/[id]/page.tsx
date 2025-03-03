// src/app/profil/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { getProfileById } from '@/app/actions/profile';
import { Box, Container, Typography, Avatar, Grid, Card, CardMedia, CardContent, Divider, Chip, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { alpha } from '@mui/material/styles';

interface Post {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
}

interface Profile {
  id: string;
  name: string;
  image: string;
  bio: string | null;
  location: string | null;
  interests: string[];
  posts: Post[];
}

export default function ProfileDetail({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfileById(params.id);
        setProfile(data);
      } catch (err) {
        setError('Nastala chyba pri načítaní profilu');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [params.id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#D32F2F' }} />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error || 'Profil sa nenašiel'}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar
          src={profile.image}
          alt={profile.name}
          sx={{
            width: 150,
            height: 150,
            margin: '0 auto',
            border: '3px solid #D32F2F',
            boxShadow: 3,
          }}
        />
        <Typography variant="h4" sx={{ mt: 2, color: '#D32F2F', fontWeight: 500 }}>
          {profile.name}
        </Typography>
        
        {profile.location && (
          <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mt={1}>
            <LocationOnIcon sx={{ color: '#D32F2F' }} />
            <Typography color="text.secondary">{profile.location}</Typography>
          </Box>
        )}
      </Box>

      {/* Bio Section */}
      {profile.bio && (
        <Box sx={{ mb: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
          <Typography variant="body1" color="text.secondary">
            {profile.bio}
          </Typography>
        </Box>
      )}

      {/* Interests */}
      {profile.interests.length > 0 && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#D32F2F' }}>
            Záujmy
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
            {profile.interests.map((interest, index) => (
              <Chip
                key={index}
                label={interest}
                sx={{
                  backgroundColor: alpha('#D32F2F', 0.1),
                  color: '#D32F2F',
                  '&:hover': { backgroundColor: alpha('#D32F2F', 0.2) },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Posts Grid */}
      <Typography variant="h5" gutterBottom sx={{ color: '#D32F2F', textAlign: 'center' }}>
        Príspevky
      </Typography>
      
      {profile.posts.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          Zatiaľ žiadne príspevky
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {profile.posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={post.imageUrl}
                  alt={post.caption || 'Post image'}
                  sx={{ 
                    aspectRatio: '1',
                    objectFit: 'cover',
                  }}
                />
                {post.caption && (
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {post.caption}
                    </Typography>
                  </CardContent>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}