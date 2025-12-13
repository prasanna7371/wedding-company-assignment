const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Log connection attempt (hide password)
    const uri = process.env.MONGODB_URI;
    const safeUri = uri.replace(/:([^:@]{8})[^:@]*@/, ':****@');
    console.log('Attempting MongoDB connection to:', safeUri);

    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✓ MongoDB Connected Successfully');
    console.log(`✓ Database Host: ${conn.connection.host}`);
    console.log(`✓ Database Name: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n🔍 DNS Resolution Failed - Possible Issues:');
      console.error('1. Check if MongoDB URI is correct');
      console.error('2. Verify MongoDB Atlas cluster is active');
      console.error('3. Check network connectivity');
    }
    
    throw error;
  }
};

const createDynamicConnection = async (orgName) => {
  try {
    const dbName = `org_${orgName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const uri = process.env.MONGODB_URI.replace(/\/[^/?]+(\?|$)/, `/${dbName}$1`);
    
    const connection = mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    await new Promise((resolve, reject) => {
      connection.once('open', resolve);
      connection.once('error', reject);
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