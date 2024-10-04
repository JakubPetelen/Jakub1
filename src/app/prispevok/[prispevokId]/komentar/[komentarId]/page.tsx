//src/app/prispevok/[prispevokId]/komentar/[komentarId]/page.tsx


import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";


export const metadata = { title: 'Komentár príspevku | ZoškaSnap' };



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
        <Typography> Komentár číslo: {params.komentarId} príspevok číslo: {params.prispevokId}</Typography>
        <Typography> Príspevok číslo: {params.prispevokId} komentár číslo: {params.komentarId}</Typography>
    </Container>
  );
    
}
