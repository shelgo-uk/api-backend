const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');
const { auth } = require('../middlewares/auth.js');

router.post('/submit',          ctrl.submit);                    // public
router.get('/admin/leads',      auth, ctrl.getAll);              // admin
router.put('/admin/:id/status', auth, ctrl.updateStatus);        // admin
router.delete('/admin/:id',     auth, ctrl.deleteLead);          // admin

module.exports = router;
