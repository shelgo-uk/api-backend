const db = require('../config/db');

const CategoryPage = {

    // Get config for a category (by categoryId)
    getByCategory: async (categoryId) => {
        const [rows] = await db.execute(
            'SELECT * FROM category_page_config WHERE categoryId = ?',
            [categoryId]
        );
        return rows[0] || null;
    },

    // Upsert config for a category
    save: async (categoryId, config) => {
        const configStr = typeof config === 'string' ? config : JSON.stringify(config);
        const [existing] = await db.execute(
            'SELECT id FROM category_page_config WHERE categoryId = ?',
            [categoryId]
        );
        if (existing.length > 0) {
            await db.execute(
                'UPDATE category_page_config SET config = ?, updated_at = NOW() WHERE categoryId = ?',
                [configStr, categoryId]
            );
        } else {
            await db.execute(
                'INSERT INTO category_page_config (categoryId, config, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
                [categoryId, configStr]
            );
        }
        return CategoryPage.getByCategory(categoryId);
    },

    // Get all configs (admin list)
    getAll: async () => {
        const [rows] = await db.execute(
            `SELECT cpc.*, c.name AS categoryName, c.image AS categoryImage
             FROM category_page_config cpc
             JOIN categories c ON c.id = cpc.categoryId
             ORDER BY c.name ASC`
        );
        return rows;
    }
};

module.exports = CategoryPage;
