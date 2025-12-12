const mongoose = require('mongoose');

// Database connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✓ MongoDB Connected:', conn.connection.host);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Function to create separate database for each organization
const createDynamicConnection = async (orgName) => {
  try {
    // Convert org name to valid database name
    const dbName = `org_${orgName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    
    // Create new connection URI with org-specific database
    const uri = process.env.MONGODB_URI.replace(/\/[^/]+(\?|$)/, `/${dbName}$1`);
    
    const connection = mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Wait for connection to be established
    await new Promise((resolve, reject) => {
      connection.once('open', resolve);
      connection.once('error', reject);
    });
    
    console.log(`✓ Created dynamic database: ${dbName}`);
    return connection;
  } catch (error) {
    console.error('Dynamic connection error:', error);
    throw error;
  }
};

module.exports = { connectDB, createDynamicConnection };