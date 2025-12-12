const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Organization = require('../models/Organization');

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const organization = await Organization.findById(admin.organization_id);

    const token = jwt.sign(
      { 
        id: admin._id,
        email: admin.email,
        organization_id: admin.organization_id
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        organization_id: organization?._id,
        organization_name: organization?.organization_name
      }
    });

  } catch (error) {
    next(error);
  }
};