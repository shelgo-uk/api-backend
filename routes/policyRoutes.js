const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/policyController');
const { auth } = require('../middlewares/auth.js');

router.get('/getAll',        ctrl.getAll);           // public
router.get('/:slug',         ctrl.getBySlug);        // public
router.post('/save/:slug',   auth, ctrl.save);       // admin

module.exports = router;
