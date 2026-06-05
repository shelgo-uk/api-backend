const db = require('../config/db');

const Contact = {

    create: async (data) => {
        const [r] = await db.execute(
            `INSERT INTO contact_leads (name, email, phone, subject, message, status, created_at, updated_at)
             VALUES (?,?,?,?,?,?,NOW(),NOW())`,
            [data.name, data.email, data.phone || null, data.subject || null, data.message, 'new']
        );
        return Contact.getById(r.insertId);
    },

    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM contact_leads WHERE id=?', [id]);
        return rows[0] || null;
    },

    getAll: async ({ page = 1, limit = 20, status = '' } = {}) => {
        const offset = (page - 1) * limit;
        let where = '';
        const params = [];
        if (status) { where = 'WHERE status=?'; params.push(status); }
        const [rows] = await db.execute(
            `SELECT * FROM contact_leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );
        const [cnt] = await db.execute(
            `SELECT COUNT(*) AS total FROM contact_leads ${where}`, params
        );
        return { data: rows, total: cnt[0].total };
    },

    updateStatus: async (id, status) => {
        await db.execute(
            'UPDATE contact_leads SET status=?, updated_at=NOW() WHERE id=?',
            [status, id]
        );
        return Contact.getById(id);
    },

    delete: async (id) => {
        await db.execute('DELETE FROM contact_leads WHERE id=?', [id]);
    }
};

module.exports = Contact;
