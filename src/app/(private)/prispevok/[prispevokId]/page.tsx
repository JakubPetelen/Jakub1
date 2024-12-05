// src/app/prispevok/page.tsx

import Typography from '@mui/material/Typography';

export const metadata = { title: 'Príspevok | ZoskaSnap'};

export default function PostDetail({
  params,

}: {
  params: {
    prispevokId: string;
  }
}) {
  return (
    <Typography>Príspevok {params.prispevokId}</Typography>
  );
}