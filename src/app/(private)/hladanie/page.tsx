// src/app/hladanie/page.tsx

import ProfileSearch from '@/components/ProfileSearch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export const metadata = { title: 'Hľadať | ZoskaSnap' };

export default function Search() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Hľadať používateľov
        </Typography>
        <ProfileSearch />
      </Box>
    </Container>
  );
}