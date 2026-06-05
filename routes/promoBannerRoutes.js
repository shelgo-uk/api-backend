const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/promoBannerController');
const { auth } = require('../middlewares/auth.js');

router.get('/getActive', ctrl.getActive);          // public
router.get('/getAll', auth, ctrl.getAll);           // admin
router.post('/saveAll', auth, ctrl.saveAll);        // admin

module.exports = router;
