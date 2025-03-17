//src/app/api/profile/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/api/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("Unauthorized access: No session found");
    return NextResponse.json({ error: 'Neautorizovaný prístup' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Používateľ nebol nájdený' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: "Failed to fetch profile.", details: errorMessage }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("Unauthorized access: No session found");
    return NextResponse.json({ error: 'Neautorizovaný prístup' }, { status: 401 });
  }

  try {
    const { username, bio, location } = await req.json();
    console.log("Request Payload:", { username, bio, location });

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name: username,
        bio: bio,
        location: location 
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error saving changes:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: "Failed to save changes.", details: errorMessage }, { status: 500 });
  }
}
