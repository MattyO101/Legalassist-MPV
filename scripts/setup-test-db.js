const { MongoClient } = require('mongodb');

const setupTestDb = async () => {
  try {
    // Connection URL for test database
    const dbUrl = 'mongodb://localhost:27017/legalassist-test';

    // Connect to the database and clean it
    await cleanDatabase(dbUrl);

    console.log('Test database setup complete');
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
};

const cleanDatabase = async (url) => {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    // Drop each collection
    for (const collection of collections) {
      await db.collection(collection.name).drop();
    }
    
    console.log(`Database at ${url} cleaned`);
  } catch (error) {
    console.error(`Error cleaning database at ${url}:`, error);
  } finally {
    await client.close();
  }
};

// Run the setup
setupTestDb(); 