const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Master Database connected successfully');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
};

const createDynamicConnection = async (orgName) => {
  const dbName = `org_${orgName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const connection = await mongoose.createConnection(
    process.env.MONGODB_URI.replace(/\/[^/]+$/, `/${dbName}`)
  );
  return connection;
};

module.exports = { connectDB, createDynamicConnection };
