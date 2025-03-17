'use client';

import { useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import { getServerSession } from 'next-auth';
import prisma from '@/app/api/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

const ProfilePage = () => {
  const [user, setUser] = useState<{ id: string; name: string; email: string; image: string | null; bio: string | null; location: string | null } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getServerSession(authOptions);
      if (session && session.user) {
        const userData = await prisma.user.findUnique({
          where: { id: session.user.id },
        });
        if (userData) {
          setUser({
            id: userData.id,
            name: userData.name || 'Unknown',
            email: userData.email,
            image: userData.image || '',
            bio: userData.bio || 'No bio available',
            location: userData.location || 'No location available',
          });
        }
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4">Profile</Typography>
      <Typography variant="h6">Username: {user.name}</Typography>
      <Typography variant="body1">Bio: {user.bio || 'No bio available'}</Typography>
      <Typography variant="body1">Location: {user.location || 'No location available'}</Typography>
      <Button variant="contained" color="primary">Edit</Button>
    </div>
  );
};

export default ProfilePage; 