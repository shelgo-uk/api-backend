const db = require('../config/db');

// Layout: 3 rows × columns per row = [1, 2, 1]
const ROW_COLS = [1, 2, 1];

const PromoBanner = {

    // Get all 4 slots (3 rows: 1+2+1 = 4 cells)
    getAll: async () => {
        const [rows] = await db.execute(
            'SELECT * FROM promo_banners ORDER BY rowIndex ASC, colIndex ASC'
        );
        return rows;
    },

    // Get only active banners for UI
    getActive: async () => {
        const [rows] = await db.execute(
            'SELECT id, rowIndex, colIndex, url, redirectionUrl, label FROM promo_banners WHERE isActive = 1 ORDER BY rowIndex ASC, colIndex ASC'
        );
        return rows;
    },

    // Upsert a single slot
    upsert: async (rowIndex, colIndex, data) => {
        const [existing] = await db.execute(
            'SELECT id FROM promo_banners WHERE rowIndex = ? AND colIndex = ?',
            [rowIndex, colIndex]
        );
        if (existing.length > 0) {
            await db.execute(
                'UPDATE promo_banners SET url=?, redirectionUrl=?, label=?, isActive=?, updated_at=NOW() WHERE rowIndex=? AND colIndex=?',
                [data.url || null, data.redirectionUrl || null, data.label || null, data.isActive ? 1 : 0, rowIndex, colIndex]
            );
        } else {
            await db.execute(
                'INSERT INTO promo_banners (rowIndex, colIndex, url, redirectionUrl, label, isActive, created_at, updated_at) VALUES (?,?,?,?,?,?,NOW(),NOW())',
                [rowIndex, colIndex, data.url || null, data.redirectionUrl || null, data.label || null, data.isActive ? 1 : 0]
            );
        }
        const [result] = await db.execute(
            'SELECT * FROM promo_banners WHERE rowIndex=? AND colIndex=?',
            [rowIndex, colIndex]
        );
        return result[0];
    },

    // Save all slots at once (array of {rowIndex, colIndex, url, redirectionUrl, label, isActive})
    saveAll: async (slots) => {
        for (const slot of slots) {
            await PromoBanner.upsert(slot.rowIndex, slot.colIndex, slot);
        }
        return PromoBanner.getAll();
    }
};

module.exports = PromoBanner;
