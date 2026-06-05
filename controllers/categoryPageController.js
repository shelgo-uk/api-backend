const CategoryPage = require('../models/categoryPageModel');
const Category = require('../models/categoryModel');

// Public — get page config by categoryId
exports.getPublic = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const row = await CategoryPage.getByCategory(categoryId);
        if (!row) return res.json({ status: 'success', data: null });
        let config = {};
        try { config = JSON.parse(row.config); } catch {}
        res.json({ status: 'success', data: { ...row, config } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin — get config by categoryId
exports.getAdmin = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const row = await CategoryPage.getByCategory(categoryId);
        if (!row) return res.json({ status: 'success', data: null });
        let config = {};
        try { config = JSON.parse(row.config); } catch {}
        res.json({ status: 'success', data: { ...row, config } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin — save config for a category
exports.save = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { config } = req.body;
        if (!config) return res.status(400).json({ error: 'config required' });
        const result = await CategoryPage.save(categoryId, config);
        let parsed = {};
        try { parsed = JSON.parse(result.config); } catch {}
        res.json({ status: 'success', data: { ...result, config: parsed } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin — list all configured categories
exports.getAll = async (req, res) => {
    try {
        const rows = await CategoryPage.getAll();
        res.json({ status: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
