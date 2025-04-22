require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function createTestAnalysis() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/roseintel';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    const testAnalysis = {
      userId: "nextauth|test-user", // Using NextAuth user ID format
      propertyAddress: "123 Test Street, Example City, ST 12345",
      propertyType: "Single Family Home",
      source: "Zillow",
      propertyUrl: "https://www.zillow.com/example",
      monthlyRent: 2500,
      downPayment: 50000,
      loanTermYears: 30,
      interestRate: 4.5,
      expenses: {
        "Mortgage": 1200,
        "Property Tax": 250,
        "Insurance": 100,
        "Utilities": 150,
        "Maintenance": 200
      },
      notes: "Great property in an up-and-coming neighborhood",
      tags: ["Single Family", "Good Schools", "Low Maintenance"],
      results: {
        cashFlow: 600,
        roi: 12.5,
        capRate: 6.8
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('analyses').insertOne(testAnalysis);
    console.log('Test analysis created with ID:', result.insertedId);
    
    return result.insertedId;
  } finally {
    await client.close();
  }
}

createTestAnalysis()
  .then(id => {
    console.log('Success! Use this ID to test the analysis page:', id);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error creating test analysis:', error);
    process.exit(1);
  }); 