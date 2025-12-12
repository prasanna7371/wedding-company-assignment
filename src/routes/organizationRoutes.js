const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization
} = require('../controllers/organizationController');

router.post('/create', createOrganization);
router.get('/get/:organization_name', getOrganization);
router.put('/update/:organization_name', updateOrganization);
router.delete('/delete/:organization_name', protect, deleteOrganization);

module.exports = router;