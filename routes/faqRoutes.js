const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/faqController');
const { auth } = require('../middlewares/auth.js');

// Public
router.get('/public/categories',                    ctrl.getPublicCategories);
router.get('/public/categories/:categoryId/articles', ctrl.getPublicArticlesByCategory);
router.get('/public/articles/:id',                  ctrl.getArticleById);

// Admin
router.get('/admin/categories',                     auth, ctrl.getAllCategories);
router.post('/admin/categories',                    auth, ctrl.createCategory);
router.put('/admin/categories/:id',                 auth, ctrl.updateCategory);
router.delete('/admin/categories/:id',              auth, ctrl.deleteCategory);
router.get('/admin/categories/:categoryId/articles', auth, ctrl.getArticlesByCategory);
router.post('/admin/articles',                      auth, ctrl.createArticle);
router.put('/admin/articles/:id',                   auth, ctrl.updateArticle);
router.delete('/admin/articles/:id',                auth, ctrl.deleteArticle);

module.exports = router;
