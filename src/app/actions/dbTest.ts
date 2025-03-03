import { db } from '@/lib/db';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Count users
    const userCount = await db.user.count();
    console.log('\nTest 1 - User count:', userCount);

    // Test 2: Get all users
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      }
    });
    console.log('\nTest 2 - All users:', JSON.stringify(users, null, 2));

    // Test 3: Get user profiles
    const profiles = await db.profile.findMany({
      include: {
        user: true
      }
    });
    console.log('\nTest 3 - All profiles:', JSON.stringify(profiles, null, 2));

    console.log('\nAll database tests completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase(); 