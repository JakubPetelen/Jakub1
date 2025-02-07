// src/app/o-mne/page.tsx
'use client';

import { Container, Typography, Box, Avatar, Divider, Link } from "@mui/material";

export default function AboutMe() {
    return (
        <Container maxWidth="md">
            {/* Profile Section */}
            <Box textAlign="center" mt={4}>
                <Avatar 
                    src="/profile.jpg" 
                    alt="Profile Picture" 
                    sx={{ width: 120, height: 120, margin: "auto" }} 
                />
                <Typography variant="h4" mt={2}>ZoškaSnap</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Full-stack developer | Tech Enthusiast | Content Creator
                </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* About Me Description */}
            <Typography variant="h5" gutterBottom>O mne</Typography>
            <Typography paragraph>
                Ahoj! Som vášnivý vývojár s láskou k moderným technológiám a dizajnu. 
                Mám skúsenosti s frontendom aj backendom a rád vytváram aplikácie, ktoré 
                riešia reálne problémy.
            </Typography>
            <Typography paragraph>
                Špecializujem sa na React, Next.js, TypeScript a Node.js. 
                Okrem programovania sa zaujímam o UI/UX dizajn a optimalizáciu výkonu aplikácií.
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Contact Section */}
            <Typography variant="h5" gutterBottom>Kontakt</Typography>
            <Typography>
                📧 Email: <Link href="mailto:jakubpetelen@gmail.com">jakubpetelen@gmail.com</Link>
            </Typography>
            <Typography>
                🌐 Web: <Link href="https://jakub1.vercel.app/" target="_blank">jakub1.vercel.app</Link>
            </Typography>
        </Container>
    );
}
