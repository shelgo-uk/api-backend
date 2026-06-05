const Policy = require('../models/policyModel');

// Public — get all policies (list)
exports.getAll = async (req, res) => {
    try {
        const rows = await Policy.getAll();
        const data = rows.map(r => ({
            ...r,
            sections: typeof r.sections === 'string' ? JSON.parse(r.sections) : r.sections
        }));
        res.json({ status: 'success', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Public — get single policy by slug
exports.getBySlug = async (req, res) => {
    try {
        const row = await Policy.getBySlug(req.params.slug);
        if (!row) return res.status(404).json({ error: 'Policy not found' });
        const data = { ...row, sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections };
        res.json({ status: 'success', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin — save policy
exports.save = async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await Policy.save(slug, req.body);
        const data = { ...result, sections: typeof result.sections === 'string' ? JSON.parse(result.sections) : result.sections };
        res.json({ status: 'success', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
