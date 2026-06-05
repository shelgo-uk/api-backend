const Contact = require('../models/contactModel');

// Public — submit contact form
exports.submit = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
        if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });
        if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });
        const lead = await Contact.create({ name, email, phone, subject, message });
        res.json({ status: 'success', data: lead });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin — get all leads
exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 20, status = '' } = req.query;
        const result = await Contact.getAll({ page: +page, limit: +limit, status });
        res.json({ status: 'success', ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin — update status
exports.updateStatus = async (req, res) => {
    try {
        const lead = await Contact.updateStatus(req.params.id, req.body.status);
        res.json({ status: 'success', data: lead });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin — delete
exports.deleteLead = async (req, res) => {
    try {
        await Contact.delete(req.params.id);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
