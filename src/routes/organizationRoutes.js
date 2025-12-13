const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization
} = require('../controllers/organizationController');

// Public routes
router.post('/create', createOrganization);
router.get('/get/:organization_name', getOrganization);

// Update route - no auth required for this assignment
router.put('/update/:organization_name', updateOrganization);

// Delete route - requires authentication
router.delete('/delete/:organization_name', protect, deleteOrganization);

module.exports = router;