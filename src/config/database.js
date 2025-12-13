const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

const createDynamicConnection = async (orgName) => {
  try {
    const dbName = `org_${orgName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const uri = process.env.MONGODB_URI.replace(/\/[^/?]+(\?|$)/, `/${dbName}$1`);
    
    const connection = mongoose.createConnection(uri);
    
    await new Promise((resolve, reject) => {
      connection.once('open', resolve);
      connection.once('error', reject);
      
      // Timeout after 10 seconds
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
    
    console.log(`✓ Dynamic database created: ${dbName}`);
    return connection;
  } catch (error) {
    console.error('❌ Dynamic connection error:', error.message);
    throw error;
  }
};

module.exports = { connectDB, createDynamicConnection };