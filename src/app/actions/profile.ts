'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function testDbConnection() {
  try {
    // Test user count
    const userCount = await db.user.count();
    console.log('Total users in database:', userCount);

    // Test getting one user
    const firstUser = await db.user.findFirst({
      include: {
        profile: true
      }
    });
    console.log('First user in database:', JSON.stringify(firstUser, null, 2));

    return { success: true, userCount, firstUser };
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw new Error('Database connection test failed');
  }
}

export async function getAllUsers() {
  try {
    const users = await db.user.findMany({
      include: {
        profile: true
      }
    });
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('Failed to get users');
  }
}

export async function searchProfiles(searchQuery: string) {
  try {
    const users = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { profile: { bio: { contains: searchQuery, mode: 'insensitive' } } },
          { profile: { location: { contains: searchQuery, mode: 'insensitive' } } }
        ]
      },
      include: {
        profile: true,
      },
      take: 10
    });

    const profiles = users.map(user => ({
      id: user.id,
      userId: user.id,
      bio: user.profile?.bio || null,
      location: user.profile?.location || null,
      user: {
        id: user.id,
        name: user.name || 'Bez mena',
        image: user.image || '/default-avatar.png',
      }
    }));

    revalidatePath('/hladanie');
    return { profiles };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Nastala chyba pri vyhľadávaní');
  }
}

export async function getProfileById(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 6
        }
      }
    });

    if (!user) {
      throw new Error('Používateľ nebol nájdený');
    }

    return {
      id: user.id,
      name: user.name || 'Bez mena',
      image: user.image || '/default-avatar.png',
      bio: user.profile?.bio || null,
      location: user.profile?.location || null,
      interests: user.profile?.interests || [],
      posts: user.posts.map(post => ({
        id: post.id,
        imageUrl: post.imageUrl,
        caption: post.caption,
        createdAt: post.createdAt
      }))
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Nastala chyba pri načítaní profilu');
  }
}