const db = require('../config/db');

// 4 fixed slugs — never change
const SLUGS = ['shipping-policy', 'return-refund-policy', 'privacy-policy', 'terms-conditions'];

const Policy = {

    getAll: async () => {
        const [rows] = await db.execute(
            'SELECT * FROM policies ORDER BY sortOrder ASC'
        );
        return rows;
    },

    getBySlug: async (slug) => {
        const [rows] = await db.execute(
            'SELECT * FROM policies WHERE slug = ?', [slug]
        );
        return rows[0] || null;
    },

    save: async (slug, data) => {
        const [existing] = await db.execute(
            'SELECT id FROM policies WHERE slug = ?', [slug]
        );
        if (existing.length > 0) {
            await db.execute(
                `UPDATE policies SET title=?, lastUpdated=?, sections=?, updated_at=NOW() WHERE slug=?`,
                [data.title, data.lastUpdated || null, JSON.stringify(data.sections || []), slug]
            );
        } else {
            await db.execute(
                `INSERT INTO policies (slug, title, lastUpdated, sections, sortOrder, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
                [slug, data.title, data.lastUpdated || null,
                 JSON.stringify(data.sections || []),
                 SLUGS.indexOf(slug) + 1]
            );
        }
        return Policy.getBySlug(slug);
    },

    // Seed default content if table is empty
    seedDefaults: async () => {
        const [rows] = await db.execute('SELECT COUNT(*) AS cnt FROM policies');
        if (rows[0].cnt > 0) return;

        const defaults = [
            {
                slug: 'shipping-policy',
                title: 'Shipping Policy',
                lastUpdated: 'January 2026',
                sortOrder: 1,
                sections: [
                    { heading: 'Delivery Options', content: 'We offer Standard and Express delivery options. Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days.' },
                    { heading: 'Delivery Charges', content: 'Standard delivery is free on orders over £50. Express delivery charges apply at checkout.' },
                    { heading: 'International Shipping', content: 'We ship to selected international destinations. Delivery times and charges vary by location.' },
                    { heading: 'Order Tracking', content: 'Once your order has been dispatched, you will receive a confirmation email with tracking details.' },
                ]
            },
            {
                slug: 'return-refund-policy',
                title: 'Return & Refund Policy',
                lastUpdated: 'January 2026',
                sortOrder: 2,
                sections: [
                    { heading: 'Returns Window', content: 'You have 28 days from the date of delivery to return any item for a full refund, provided it is in its original condition with tags attached.' },
                    { heading: 'How to Return', content: 'To initiate a return, log in to your account and visit My Orders. Select the item you wish to return and follow the instructions.' },
                    { heading: 'Refund Processing', content: 'Refunds are processed within 5-7 business days of receiving your return. The refund will be credited to your original payment method.' },
                    { heading: 'Non-Returnable Items', content: 'For hygiene reasons, underwear, swimwear, and pierced jewellery cannot be returned unless faulty.' },
                    { heading: 'Faulty Items', content: 'If you receive a faulty item, please contact our customer services team immediately. We will arrange a free return and replacement or full refund.' },
                ]
            },
            {
                slug: 'privacy-policy',
                title: 'Privacy Policy',
                lastUpdated: 'January 2026',
                sortOrder: 3,
                sections: [
                    { heading: 'Introduction', content: 'Choosing to shop with us means you\'ve placed trust in us to handle your personal data responsibly. In sharing your personal data we hope you in return benefit from a tailored and convenient shopping experience.' },
                    { heading: 'Who We Are', content: 'We are a retail company committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.' },
                    { heading: 'Data We Collect', content: 'We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email address, delivery address, and payment information.' },
                    { heading: 'How We Use Your Data', content: 'We use your data to process orders, provide customer service, send order updates, and improve our services. We may also send you marketing communications if you have opted in.' },
                    { heading: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. You can manage your preferences in your account settings or by contacting us.' },
                    { heading: 'Cookie Policy', content: 'We use cookies to improve your browsing experience, analyse site traffic, and personalise content. You can manage cookie preferences at any time.' },
                    { heading: 'Data Security', content: 'We take appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse.' },
                    { heading: 'Contact Us', content: 'If you have any questions about this privacy policy or how we handle your data, please contact our Data Protection team.' },
                ]
            },
            {
                slug: 'terms-conditions',
                title: 'Terms & Conditions',
                lastUpdated: 'January 2026',
                sortOrder: 4,
                sections: [
                    { heading: 'Acceptance of Terms', content: 'By accessing and using our website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.' },
                    { heading: 'Use of Website', content: 'You may use our website for lawful purposes only. You must not use it in any way that breaches any applicable local, national, or international law or regulation.' },
                    { heading: 'Account Registration', content: 'When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.' },
                    { heading: 'Orders and Payment', content: 'All orders are subject to availability and acceptance. We reserve the right to refuse or cancel any order. Payment must be made in full at the time of ordering.' },
                    { heading: 'Pricing', content: 'All prices are shown in the currency displayed and include applicable taxes. We reserve the right to change prices at any time without notice.' },
                    { heading: 'Intellectual Property', content: 'All content on this website, including text, images, logos, and designs, is our property and is protected by copyright and other intellectual property laws.' },
                    { heading: 'Limitation of Liability', content: 'To the fullest extent permitted by law, we exclude all liability for any loss or damage arising from your use of our website or products.' },
                    { heading: 'Governing Law', content: 'These terms are governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.' },
                ]
            },
        ];

        for (const p of defaults) {
            await db.execute(
                `INSERT IGNORE INTO policies (slug, title, lastUpdated, sections, sortOrder, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
                [p.slug, p.title, p.lastUpdated, JSON.stringify(p.sections), p.sortOrder]
            );
        }
    }
};

module.exports = Policy;
