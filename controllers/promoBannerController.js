const PromoBanner = require('../models/promoBannerModel');

// Public — active banners for UI
exports.getActive = async (req, res) => {
    try {
        const banners = await PromoBanner.getActive();
        res.json({ status: 'success', data: banners });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin — all banners
exports.getAll = async (req, res) => {
    try {
        const banners = await PromoBanner.getAll();
        res.json({ status: 'success', data: banners });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin — save all slots
exports.saveAll = async (req, res) => {
    try {
        const { slots } = req.body;
        if (!Array.isArray(slots)) return res.status(400).json({ error: 'slots array required' });
        const result = await PromoBanner.saveAll(slots);
        res.json({ status: 'success', data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
