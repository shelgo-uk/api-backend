const db = require('../config/db');

const FAQ = {

    // ── Categories ────────────────────────────────────────────────────────────
    getAllCategories: async () => {
        const [rows] = await db.execute(
            'SELECT * FROM faq_categories ORDER BY sortOrder ASC, name ASC'
        );
        return rows;
    },

    getCategoryById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM faq_categories WHERE id = ?', [id]);
        return rows[0] || null;
    },

    createCategory: async (data) => {
        const [r] = await db.execute(
            'INSERT INTO faq_categories (name, icon, sortOrder, isActive, created_at, updated_at) VALUES (?,?,?,?,NOW(),NOW())',
            [data.name, data.icon || null, data.sortOrder || 0, data.isActive !== false ? 1 : 0]
        );
        return FAQ.getCategoryById(r.insertId);
    },

    updateCategory: async (id, data) => {
        await db.execute(
            'UPDATE faq_categories SET name=?, icon=?, sortOrder=?, isActive=?, updated_at=NOW() WHERE id=?',
            [data.name, data.icon || null, data.sortOrder || 0, data.isActive !== false ? 1 : 0, id]
        );
        return FAQ.getCategoryById(id);
    },

    deleteCategory: async (id) => {
        await db.execute('DELETE FROM faq_categories WHERE id=?', [id]);
    },

    // ── Articles ──────────────────────────────────────────────────────────────
    getArticlesByCategory: async (categoryId) => {
        const [rows] = await db.execute(
            'SELECT * FROM faq_articles WHERE categoryId=? ORDER BY sortOrder ASC, title ASC',
            [categoryId]
        );
        return rows;
    },

    getArticleById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM faq_articles WHERE id=?', [id]);
        return rows[0] || null;
    },

    createArticle: async (data) => {
        const [r] = await db.execute(
            'INSERT INTO faq_articles (categoryId, title, content, sortOrder, isActive, created_at, updated_at) VALUES (?,?,?,?,?,NOW(),NOW())',
            [data.categoryId, data.title, data.content || '', data.sortOrder || 0, data.isActive !== false ? 1 : 0]
        );
        return FAQ.getArticleById(r.insertId);
    },

    updateArticle: async (id, data) => {
        await db.execute(
            'UPDATE faq_articles SET categoryId=?, title=?, content=?, sortOrder=?, isActive=?, updated_at=NOW() WHERE id=?',
            [data.categoryId, data.title, data.content || '', data.sortOrder || 0, data.isActive !== false ? 1 : 0, id]
        );
        return FAQ.getArticleById(id);
    },

    deleteArticle: async (id) => {
        await db.execute('DELETE FROM faq_articles WHERE id=?', [id]);
    },

    // Public — active categories with their active articles (preview: first 3)
    getPublicCategories: async () => {
        const [cats] = await db.execute(
            'SELECT * FROM faq_categories WHERE isActive=1 ORDER BY sortOrder ASC, name ASC'
        );
        for (const cat of cats) {
            const [arts] = await db.execute(
                'SELECT id, title FROM faq_articles WHERE categoryId=? AND isActive=1 ORDER BY sortOrder ASC, title ASC LIMIT 3',
                [cat.id]
            );
            cat.articles = arts;
        }
        return cats;
    },

    // Public — all active articles in a category
    getPublicArticlesByCategory: async (categoryId) => {
        const [rows] = await db.execute(
            'SELECT id, title FROM faq_articles WHERE categoryId=? AND isActive=1 ORDER BY sortOrder ASC, title ASC',
            [categoryId]
        );
        return rows;
    },

    // Seed default FAQ content
    seedDefaults: async () => {
        const [check] = await db.execute('SELECT COUNT(*) AS cnt FROM faq_categories');
        if (check[0].cnt > 0) return;

        const categories = [
            { name: 'Returns & Refunds',   icon: 'fa-light fa-arrow-rotate-left', sortOrder: 1 },
            { name: 'Ordering & Delivery', icon: 'fa-light fa-truck',             sortOrder: 2 },
            { name: 'Payments',            icon: 'fa-light fa-credit-card',       sortOrder: 3 },
            { name: 'My Account',          icon: 'fa-light fa-circle-user',       sortOrder: 4 },
            { name: 'Product Information', icon: 'fa-light fa-tag',               sortOrder: 5 },
            { name: 'Store Information',   icon: 'fa-light fa-store',             sortOrder: 6 },
            { name: 'Other',               icon: 'fa-light fa-ellipsis',          sortOrder: 7 },
        ];

        const articles = {
            'Returns & Refunds': [
                {
                    title: 'How can I return my items?',
                    content: `<p>To make things easy, we have a number of return methods for you to choose from.</p>
<p>Before you do return your item, just make sure to read our returns policy to check that your item is eligible for a full refund.</p>
<p>If returning to one of our <strong>stores</strong>, please ensure all <strong>items are returned in the individual clear plastic bags</strong> that they came in and we'll do the rest.</p>
<p>If returning via <strong>courier</strong>, please ensure the item is in its' <strong>individual plastic bag</strong> that it came in, and place the item in the original parcel bag. Then attach one returns label (regardless of the number of items coming back).</p>
<p>Just click on one of the options below for more information on how to return.</p>`
                },
                {
                    title: 'Refunds',
                    content: `<p>Once we have received your return, we aim to process your refund within 5–7 working days.</p>
<p>Your refund will be credited to the original payment method used when placing the order.</p>
<p>You will receive an email confirmation once your refund has been processed.</p>`
                },
                {
                    title: 'Our Returns Policy',
                    content: `<p>You have 28 days from the date of delivery to return any item for a full refund, provided it is in its original condition with tags attached.</p>
<p>For hygiene reasons, underwear, swimwear, and pierced jewellery cannot be returned unless faulty.</p>
<p>Sale items can be returned within 14 days of purchase.</p>`
                },
                {
                    title: 'Can I get a gift receipt for my online order?',
                    content: `<p>Yes, you can request a gift receipt when placing your order at checkout.</p>
<p>The gift receipt will be included in your parcel and can be used by the recipient to exchange or return the item.</p>`
                },
            ],
            'Ordering & Delivery': [
                {
                    title: 'How to place an order?',
                    content: `<p>Placing an order is simple. Browse our website, add items to your bag, and proceed to checkout.</p>
<p>You will need to be signed in to your account or create a new account to complete your purchase.</p>
<p>Select your delivery address, choose a delivery date, and complete payment to confirm your order.</p>`
                },
                {
                    title: 'How to track my order?',
                    content: `<p>Once your order has been dispatched, you will receive a confirmation email with tracking details.</p>
<p>You can also track your order by logging into your account and visiting the My Orders section.</p>`
                },
                {
                    title: 'What are my delivery options?',
                    content: `<p>We offer Standard Delivery (3–5 working days) and Express Delivery (1–2 working days).</p>
<p>Standard delivery is free on orders over £50. Express delivery charges apply at checkout.</p>
<p>You can select your preferred delivery date during checkout.</p>`
                },
                {
                    title: 'Can I change my delivery address?',
                    content: `<p>If your order has not yet been dispatched, you may be able to change your delivery address by contacting our customer services team.</p>
<p>Once an order has been dispatched, we are unable to change the delivery address.</p>`
                },
            ],
            'Payments': [
                {
                    title: 'What payment methods do you accept?',
                    content: `<p>We accept payments via Razorpay, which supports all major credit and debit cards.</p>
<p>We also accept PayPal, Google Pay, and gift cards/eVouchers.</p>`
                },
                {
                    title: 'Is my payment information secure?',
                    content: `<p>Yes, all payments are processed securely through Razorpay, which uses industry-standard encryption.</p>
<p>We do not store your card details on our servers.</p>`
                },
                {
                    title: 'Why was my payment declined?',
                    content: `<p>Payments can be declined for a number of reasons, including insufficient funds, incorrect card details, or your bank blocking the transaction.</p>
<p>Please check your card details and try again, or contact your bank for more information.</p>`
                },
                {
                    title: 'Checking the balance of a Gift Card / eVoucher',
                    content: `<p>You can check the balance of your gift card or eVoucher by logging into your account and visiting the Gift Cards section.</p>
<p>Alternatively, contact our customer services team with your gift card number.</p>`
                },
            ],
            'My Account': [
                {
                    title: 'How do I create an account?',
                    content: `<p>Creating an account is quick and easy. Click on the account icon in the top right corner of the website and select "Register here".</p>
<p>Fill in your details and click "Create Account". You will receive a confirmation email shortly after.</p>`
                },
                {
                    title: 'Changing personal details',
                    content: `<p>You can update your personal details by logging into your account and visiting the "Change Details" section.</p>
<p>From there you can update your name, email address, password, mobile number, and date of birth.</p>`
                },
                {
                    title: "Sign into 'My Account'",
                    content: `<p>Click on the account icon in the top right corner of the website and select "Sign In".</p>
<p>Enter your email address and password to access your account.</p>
<p>If you have forgotten your password, click "Forgot Password" to reset it.</p>`
                },
                {
                    title: 'Opening an account',
                    content: `<p>To open an account, click on the account icon and select "Register here".</p>
<p>You will need to provide your name, email address, and create a password.</p>`
                },
            ],
            'Product Information': [
                {
                    title: 'Sizing Guides',
                    content: `<p>Our sizing guides are available on each product page. Click on "Size Guide" to view measurements for that specific item.</p>
<p>We recommend measuring yourself and comparing to our size guide before ordering to ensure the best fit.</p>`
                },
                {
                    title: 'Product recalls & safety notices',
                    content: `<p>We take product safety very seriously. If a product recall is issued, we will contact all affected customers directly.</p>
<p>You can also check our website for the latest product safety notices.</p>`
                },
                {
                    title: 'How do I care for my items?',
                    content: `<p>Care instructions are printed on the label of each item. Please follow these instructions carefully to maintain the quality of your purchase.</p>
<p>You can also find care instructions on the product page of our website.</p>`
                },
            ],
            'Store Information': [
                {
                    title: 'Store Opening Times',
                    content: `<p>Store opening times vary by location. Please use our Store Locator to find your nearest store and check its opening hours.</p>
<p>Most stores are open Monday to Saturday 9am–6pm and Sunday 10am–4pm.</p>`
                },
                {
                    title: 'Do you offer Gift Receipts in Store?',
                    content: `<p>Yes, gift receipts are available in all our stores. Simply ask a member of staff at the till when making your purchase.</p>`
                },
                {
                    title: 'Can I return online orders to a store?',
                    content: `<p>Yes, you can return most online orders to any of our stores. Simply bring the item with your order confirmation email or delivery note.</p>
<p>Store returns are free and you will receive your refund sooner than a postal return.</p>`
                },
            ],
            'Other': [
                {
                    title: 'Complaints Process',
                    content: `<p>If you are unhappy with any aspect of our service, please contact our customer services team who will be happy to help.</p>
<p>You can reach us by phone on 0333 777 8000 or via our online contact form.</p>
<p>We aim to resolve all complaints within 5 working days.</p>`
                },
                {
                    title: 'Accessibility Policy',
                    content: `<p>We are committed to making our website accessible to all users. If you experience any accessibility issues, please contact us.</p>
<p>We continually work to improve the accessibility of our website in line with WCAG 2.1 guidelines.</p>`
                },
                {
                    title: 'Contact Us',
                    content: `<p>You can contact our customer services team by:</p>
<ul>
<li>Phone: 0333 777 8000 (Monday–Friday 8am–9pm, Saturday–Sunday 8am–7pm)</li>
<li>Online: Use our contact form on the website</li>
<li>In store: Visit any of our stores</li>
</ul>`
                },
            ],
        };

        for (const cat of categories) {
            const [r] = await db.execute(
                'INSERT INTO faq_categories (name, icon, sortOrder, isActive, created_at, updated_at) VALUES (?,?,?,1,NOW(),NOW())',
                [cat.name, cat.icon, cat.sortOrder]
            );
            const catId = r.insertId;
            const arts = articles[cat.name] || [];
            for (let i = 0; i < arts.length; i++) {
                await db.execute(
                    'INSERT INTO faq_articles (categoryId, title, content, sortOrder, isActive, created_at, updated_at) VALUES (?,?,?,?,1,NOW(),NOW())',
                    [catId, arts[i].title, arts[i].content, i + 1]
                );
            }
        }
    }
};

module.exports = FAQ;
