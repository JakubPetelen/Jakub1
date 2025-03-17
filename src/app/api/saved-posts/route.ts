import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/api/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Neautorizovaný prístup' }, { status: 401 });
  }

  try {
    const { postId } = await request.json() as { postId: string };
    
    // Check if the post is already saved to avoid duplicate save attempts
    const existingPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });
    
    if (existingPost) {
      return NextResponse.json({ success: true, savedPost: existingPost });
    }
    
    const savedPost = await prisma.savedPost.create({
      data: {
        userId: session.user.id,
        postId: postId,
      },
      include: {
        post: {
          include: {
            user: true
          }
        }
      }
    });
    return NextResponse.json({ success: true, savedPost });
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Neautorizovaný prístup' }, { status: 401 });
  }

  try {
    const { postId } = await request.json();
    
    // Check if the post exists before trying to delete
    const existingPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });
    
    if (!existingPost) {
      return NextResponse.json({ success: true }); // Already not saved, so return success
    }
    
    await prisma.savedPost.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsaving post:", error);
    return NextResponse.json({ error: "Failed to unsave post" }, { status: 500 });
  }
}

// Cache headers for better performance
const cacheHeaders = {
  'Cache-Control': 'public, max-age=10, stale-while-revalidate=59',
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Neautorizovaný prístup' }, { status: 401 });
  }

  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId: session.user.id },
      take: 50, // Limit the number of posts to improve performance
      include: {
        post: {
          include: {
            user: true
          }
        }
      }
    });
    return NextResponse.json({ success: true, savedPosts }, { headers: cacheHeaders });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return NextResponse.json({ error: "Failed to fetch saved posts" }, { status: 500 });
  }
}
