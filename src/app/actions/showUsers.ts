import { db } from '@/lib/db';

interface User {
  id: string;
  name: string | null;
  profile?: {
    bio: string | null;
    location: string | null;
  } | null;
}

async function showUsers() {
  const users = await db.user.findMany({
    include: {
      profile: true
    }
  });
  
  console.log('Available users to search for:');
  users.forEach((user: User) => {
    console.log(`- Name: ${user.name || 'No name'}`);
    if (user.profile) {
      console.log(`  Bio: ${user.profile.bio || 'No bio'}`);
      console.log(`  Location: ${user.profile.location || 'No location'}`);
    }
    console.log('---');
  });
}

showUsers(); 