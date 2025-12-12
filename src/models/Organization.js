const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  organization_name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  collection_name: {
    type: String,
    required: true
  },
  admin_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  connection_details: {
    database_name: String,
    created_at: Date
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Organization', organizationSchema);