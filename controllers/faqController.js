const FAQ = require('../models/faqModel');

// ── Public ────────────────────────────────────────────────────────────────────
exports.getPublicCategories = async (req, res) => {
    try {
        const data = await FAQ.getPublicCategories();
        res.json({ status: 'success', data });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getPublicArticlesByCategory = async (req, res) => {
    try {
        const data = await FAQ.getPublicArticlesByCategory(req.params.categoryId);
        res.json({ status: 'success', data });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await FAQ.getArticleById(req.params.id);
        if (!article) return res.status(404).json({ error: 'Not found' });
        // Also get sibling articles for sidebar
        const siblings = await FAQ.getPublicArticlesByCategory(article.categoryId);
        const category = await FAQ.getCategoryById(article.categoryId);
        res.json({ status: 'success', data: { article, siblings, category } });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── Admin ─────────────────────────────────────────────────────────────────────
exports.getAllCategories = async (req, res) => {
    try {
        const cats = await FAQ.getAllCategories();
        for (const cat of cats) {
            const arts = await FAQ.getArticlesByCategory(cat.id);
            cat.articles = arts;
        }
        res.json({ status: 'success', data: cats });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createCategory = async (req, res) => {
    try {
        const data = await FAQ.createCategory(req.body);
        res.json({ status: 'success', data });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateCategory = async (req, res) => {
    try {
        const data = await FAQ.updateCategory(req.params.id, req.body);
        res.json({ status: 'success', data });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteCategory = async (req, res) => {
    try {
        await FAQ.deleteCategory(req.params.id);
        res.json({ status: 'success' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getArticlesByCategory = async (req, res) => {
    try {
        const data = await FAQ.getArticlesByCategory(req.params.categoryId);
        res.json({ status: 'success', data });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createArticle = async (req, res) => {
    try {
        const data = await FAQ.createArticle(req.body);
        res.json({ status: 'success', data });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateArticle = async (req, res) => {
    try {
        const data = await FAQ.updateArticle(req.params.id, req.body);
        res.json({ status: 'success', data });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteArticle = async (req, res) => {
    try {
        await FAQ.deleteArticle(req.params.id);
        res.json({ status: 'success' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
