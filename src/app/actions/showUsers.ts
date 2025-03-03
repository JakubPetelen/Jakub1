import { db } from '@/lib/db';

async function showUsers() {
  const users = await db.user.findMany({
    include: {
      profile: true
    }
  });
  
  console.log('Available users to search for:');
  users.forEach(user => {
    console.log(`- Name: ${user.name || 'No name'}`);
    if (user.profile) {
      console.log(`  Bio: ${user.profile.bio || 'No bio'}`);
      console.log(`  Location: ${user.profile.location || 'No location'}`);
    }
    console.log('---');
  });
}

showUsers(); 