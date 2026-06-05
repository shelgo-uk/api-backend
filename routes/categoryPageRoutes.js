const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryPageController');
const { auth } = require('../middlewares/auth.js');

// Public
router.get('/public/:categoryId', ctrl.getPublic);

// Admin
router.get('/admin/all',          auth, ctrl.getAll);
router.get('/admin/:categoryId',  auth, ctrl.getAdmin);
router.post('/save/:categoryId',  auth, ctrl.save);

module.exports = router;
