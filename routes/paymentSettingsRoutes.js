const express = require('express');
const router = express.Router();
const { getPublicSettings, getFullSettings, updateSettings } = require('../controllers/paymentSettingsController');

router.get('/public', getPublicSettings);
router.get('/admin', getFullSettings);
router.post('/update', updateSettings);

module.exports = router;
