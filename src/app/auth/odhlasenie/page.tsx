//'use client';

// src/app/auth/odhlasenie/page.tsx

// import Typography from '@mui/material/Typography';

import SignOutView from "@/sections/SignOutView";
//import { signOut }  from "next-auth/react";

export const metadata = { title: 'Odhlásiť sa | ZoskaSnap'};

export default function SignOutPage() {
  return (<SignOutView/>);
}