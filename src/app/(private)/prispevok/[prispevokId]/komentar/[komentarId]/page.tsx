//src/app/prispevok/[prispevokId]/komentar/[komentarId]/page.tsx

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export const metadata = { title: 'Komentár príspevku | ZoskaSnap'};

export default function PostCommentDetail({
    params,

}: {
    params: {
        prispevokId: string;
        komentarId: string;
    };
}) {

    return (
        <Container>
            <Typography>Komentár čislo:{params.komentarId}, pod príspevkom číslo: {params.prispevokId}</Typography>
        </Container>
    );
}