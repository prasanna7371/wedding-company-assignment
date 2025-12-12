const Organization = require('../models/Organization');
const Admin = require('../models/Admin');
const { createDynamicConnection } = require('../config/database');

exports.createOrganization = async (req, res, next) => {
  try {
    const { organization_name, email, password } = req.body;

    if (!organization_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide organization_name, email, and password'
      });
    }

    const existingOrg = await Organization.findOne({ 
      organization_name: organization_name.toLowerCase() 
    });

    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: 'Organization name already exists'
      });
    }

    const admin = await Admin.create({
      email,
      password
    });

    const collectionName = `org_${organization_name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const organization = await Organization.create({
      organization_name: organization_name.toLowerCase(),
      collection_name: collectionName,
      admin_user_id: admin._id,
      connection_details: {
        database_name: collectionName,
        created_at: new Date()
      }
    });

    admin.organization_id = organization._id;
    await admin.save();

    await createDynamicConnection(organization_name);

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: {
        organization_id: organization._id,
        organization_name: organization.organization_name,
        collection_name: organization.collection_name,
        admin_email: email,
        created_at: organization.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.getOrganization = async (req, res, next) => {
  try {
    const { organization_name } = req.params;

    const organization = await Organization.findOne({ 
      organization_name: organization_name.toLowerCase() 
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
        created_at: organization.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.updateOrganization = async (req, res, next) => {
  try {
    const { organization_name } = req.params;
    const { email, password } = req.body;

    const organization = await Organization.findOne({ 
      organization_name: organization_name.toLowerCase() 
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    if (email || password) {
      const admin = await Admin.findById(organization.admin_user_id);
      if (email) admin.email = email;
      if (password) admin.password = password;
      await admin.save();
    }

    res.status(200).json({
      success: true,
      message: 'Organization updated successfully',
      data: {
        organization_name: organization.organization_name,
        updated_at: new Date()
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.deleteOrganization = async (req, res, next) => {
  try {
    const { organization_name } = req.params;

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const organization = await Organization.findOne({ 
      organization_name: organization_name.toLowerCase() 
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    if (organization.admin_user_id.toString() !== req.admin._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this organization'
      });
    }

    await Admin.findByIdAndDelete(organization.admin_user_id);
    await Organization.findByIdAndDelete(organization._id);

    res.status(200).json({
      success: true,
      message: 'Organization deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};