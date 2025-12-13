const Organization = require('../models/Organization');
const Admin = require('../models/Admin');
const { createDynamicConnection } = require('../config/database');

// CREATE ORGANIZATION
exports.createOrganization = async (req, res, next) => {
  try {
    const { organization_name, email, password } = req.body;

    // Validation
    if (!organization_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide organization_name, email, and password'
      });
    }

    const normalizedOrgName = organization_name.toLowerCase().trim();

    // Check if organization exists
    const existingOrg = await Organization.findOne({ 
      organization_name: normalizedOrgName
    });

    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: 'Organization name already exists'
      });
    }

    // Check if email is already used
    const existingAdmin = await Admin.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    // Create admin user
    const admin = await Admin.create({
      email: email.toLowerCase().trim(),
      password
    });

    // Create organization
    const collectionName = `org_${normalizedOrgName.replace(/[^a-z0-9]/g, '_')}`;

    const organization = await Organization.create({
      organization_name: normalizedOrgName,
      collection_name: collectionName,
      admin_user_id: admin._id,
      connection_details: {
        database_name: collectionName,
        created_at: new Date()
      }
    });

    // Link admin to organization
    admin.organization_id = organization._id;
    await admin.save();

    // Create dynamic database connection
    await createDynamicConnection(normalizedOrgName);

    // Success response
    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: {
        organization_id: organization._id,
        organization_name: organization.organization_name,
        collection_name: organization.collection_name,
        admin_email: admin.email,
        created_at: organization.createdAt
      }
    });

  } catch (error) {
    console.error('Create Organization Error:', error);
    next(error);
  }
};

// GET ORGANIZATION
exports.getOrganization = async (req, res, next) => {
  try {
    const { organization_name } = req.params;

    if (!organization_name) {
      return res.status(400).json({
        success: false,
        message: 'Organization name is required'
      });
    }

    const normalizedOrgName = organization_name.toLowerCase().trim();

    const organization = await Organization.findOne({ 
      organization_name: normalizedOrgName
    }).populate('admin_user_id', 'email');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        organization_id: organization._id,
        organization_name: organization.organization_name,
        collection_name: organization.collection_name,
        admin_email: organization.admin_user_id.email,
        created_at: organization.createdAt,
        updated_at: organization.updatedAt
      }
    });

  } catch (error) {
    console.error('Get Organization Error:', error);
    next(error);
  }
};

// UPDATE ORGANIZATION
exports.updateOrganization = async (req, res, next) => {
  try {
    const { organization_name } = req.params;
    const { email, password } = req.body;

    // Validation
    if (!organization_name) {
      return res.status(400).json({
        success: false,
        message: 'Organization name is required'
      });
    }

    if (!email && !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or password to update'
      });
    }

    const normalizedOrgName = organization_name.toLowerCase().trim();

    // Find organization
    const organization = await Organization.findOne({ 
      organization_name: normalizedOrgName
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Find admin (need to select password field for updating)
    const admin = await Admin.findById(organization.admin_user_id).select('+password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Update fields
    let updatedFields = [];

    if (email && email !== admin.email) {
      // Check if new email is already used
      const emailExists = await Admin.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: admin._id }
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another admin'
        });
      }

      admin.email = email.toLowerCase().trim();
      updatedFields.push('email');
    }

    if (password) {
      admin.password = password;
      updatedFields.push('password');
    }

    // Save admin (this will trigger password hashing)
    await admin.save();

    // Update organization timestamp
    organization.updatedAt = new Date();
    await organization.save();

    res.status(200).json({
      success: true,
      message: 'Organization updated successfully',
      data: {
        organization_name: organization.organization_name,
        admin_email: admin.email,
        updated_fields: updatedFields,
        updated_at: organization.updatedAt
      }
    });

  } catch (error) {
    console.error('Update Organization Error:', error);
    next(error);
  }
};

// DELETE ORGANIZATION
exports.deleteOrganization = async (req, res, next) => {
  try {
    const { organization_name } = req.params;

    // Check authentication
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login first.'
      });
    }

    // Validation
    if (!organization_name) {
      return res.status(400).json({
        success: false,
        message: 'Organization name is required'
      });
    }

    const normalizedOrgName = organization_name.toLowerCase().trim();

    // Find organization
    const organization = await Organization.findOne({ 
      organization_name: normalizedOrgName
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Authorization check - only the admin who owns this org can delete it
    if (organization.admin_user_id.toString() !== req.admin._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own organization.'
      });
    }

    // Store org name for response
    const deletedOrgName = organization.organization_name;

    // Delete admin user first
    await Admin.findByIdAndDelete(organization.admin_user_id);

    // Delete organization
    await Organization.findByIdAndDelete(organization._id);

    res.status(200).json({
      success: true,
      message: 'Organization and associated admin deleted successfully',
      data: {
        deleted_organization: deletedOrgName,
        deleted_at: new Date()
      }
    });

  } catch (error) {
    console.error('Delete Organization Error:', error);
    next(error);
  }
};