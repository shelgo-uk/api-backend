const { getSettings, upsertSettings } = require('../models/paymentSettingsModel');

// Public — only returns keyId (no secret)
async function getPublicSettings(req, res) {
    try {
        const settings = await getSettings();
        res.json({ keyId: settings?.razorpayKeyId || '', isActive: settings?.isActive || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Admin — returns full settings
async function getFullSettings(req, res) {
    try {
        const settings = await getSettings();
        res.json({ data: settings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateSettings(req, res) {
    try {
        const { razorpayKeyId, razorpayKeySecret, isTestMode, isActive } = req.body;
        const updated = await upsertSettings({ razorpayKeyId, razorpayKeySecret, isTestMode, isActive });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getPublicSettings, getFullSettings, updateSettings };
