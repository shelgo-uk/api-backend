const db = require('../config/db');

async function getSettings() {
    const [rows] = await db.execute('SELECT * FROM payment_settings LIMIT 1');
    return rows[0] || null;
}

async function upsertSettings(data) {
    const existing = await getSettings();
    const now = new Date();
    if (existing) {
        await db.execute(
            `UPDATE payment_settings SET razorpayKeyId=?, razorpayKeySecret=?, isTestMode=?, isActive=?, updated_at=? WHERE id=?`,
            [data.razorpayKeyId, data.razorpayKeySecret, data.isTestMode ? 1 : 0, data.isActive ? 1 : 0, now, existing.id]
        );
    } else {
        await db.execute(
            `INSERT INTO payment_settings (razorpayKeyId, razorpayKeySecret, isTestMode, isActive, created_at, updated_at) VALUES (?,?,?,?,?,?)`,
            [data.razorpayKeyId, data.razorpayKeySecret, data.isTestMode ? 1 : 0, data.isActive ? 1 : 0, now, now]
        );
    }
    return await getSettings();
}

module.exports = { getSettings, upsertSettings };
