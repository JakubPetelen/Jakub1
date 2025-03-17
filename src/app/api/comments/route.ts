import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import prisma from '@/app/api/prisma';

// Using the singleton Prisma client from prisma.ts

// Cache headers for better performance
const cacheHeaders = {
  'Cache-Control': 'public, max-age=10, stale-while-revalidate=59',
};

// Get comments for a post
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      take: 50 // Limit the number of comments to improve performance
    });

    return NextResponse.json({ comments }, { headers: cacheHeaders });
  } catch (error) {
    console.error('Error fetching comments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch comments', details: errorMessage }, { status: 500 });
  }
}

// Add a new comment
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { postId, content } = await request.json();
    
    if (!postId || !content) {
      return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 });
    }

    // Verify the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Create the comment with user association
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Comment added successfully', 
      comment 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to add comment', details: errorMessage }, { status: 500 });
  }
}