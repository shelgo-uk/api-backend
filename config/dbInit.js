const db = require('./db');

const tables = [

    // USERS
    {
        name: 'users',
        sql: `
            CREATE TABLE IF NOT EXISTS \`users\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`password\`   VARCHAR(255) NOT NULL,
                \`mobile\`     VARCHAR(20)  DEFAULT NULL,
                \`email\`      VARCHAR(255) NOT NULL,
                \`token\`      TEXT         DEFAULT NULL,
                \`roleName\`   VARCHAR(100) DEFAULT NULL,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_users_email\` (\`email\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // SITE CONFIG
    {
        name: 'siteconfig',
        sql: `
            CREATE TABLE IF NOT EXISTS \`siteconfig\` (
                \`id\`           INT(11)      NOT NULL AUTO_INCREMENT,
                \`siteName\`     VARCHAR(255) DEFAULT NULL,
                \`clientUrl\`    VARCHAR(500) DEFAULT NULL,
                \`logo\`         VARCHAR(500) DEFAULT NULL,
                \`whiteLogo\`    VARCHAR(500) DEFAULT NULL,
                \`icon\`         VARCHAR(500) DEFAULT NULL,
                \`instagramURL\` VARCHAR(500) DEFAULT NULL,
                \`facebookURL\`  VARCHAR(500) DEFAULT NULL,
                \`twitterURL\`   VARCHAR(500) DEFAULT NULL,
                \`linkedInURL\`  VARCHAR(500) DEFAULT NULL,
                \`youtubeURL\`   VARCHAR(500) DEFAULT NULL,
                \`mobile\`       VARCHAR(20)  DEFAULT NULL,
                \`email\`        VARCHAR(255) DEFAULT NULL,
                \`created_at\`   DATETIME     NOT NULL,
                \`updated_at\`   DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // FILES
    {
        name: 'files',
        sql: `
            CREATE TABLE IF NOT EXISTS \`files\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`url\`        VARCHAR(500) NOT NULL,
                \`directory\`  VARCHAR(255) DEFAULT NULL,
                \`created_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_files_directory\` (\`directory\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // HOME BANNERS
    {
        name: 'home_banners',
        sql: `
            CREATE TABLE IF NOT EXISTS \`home_banners\` (
                \`id\`             INT(11)                NOT NULL AUTO_INCREMENT,
                \`type\`           ENUM('image','video')  NOT NULL DEFAULT 'image',
                \`url\`            VARCHAR(500)           NOT NULL,
                \`forMobile\`      TINYINT(1)             NOT NULL DEFAULT 0,
                \`redirectionUrl\` VARCHAR(500)           DEFAULT NULL,
                \`sortOrder\`      INT(11)                NOT NULL DEFAULT 0,
                \`isActive\`       TINYINT(1)             NOT NULL DEFAULT 1,
                \`created_at\`     DATETIME               NOT NULL,
                \`updated_at\`     DATETIME               NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_hb_active_sort\` (\`isActive\`, \`sortOrder\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CATEGORIES
    {
        name: 'categories',
        sql: `
            CREATE TABLE IF NOT EXISTS \`categories\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`image\`      VARCHAR(500) DEFAULT NULL,
                \`parentId\`   INT(11)      DEFAULT NULL,
                \`sortOrder\`  INT(11)      NOT NULL DEFAULT 0,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_cat_parent\`      (\`parentId\`),
                INDEX \`idx_cat_active_sort\` (\`isActive\`, \`sortOrder\`),
                CONSTRAINT \`fk_cat_parent\` FOREIGN KEY (\`parentId\`)
                    REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CATEGORIES: add image column if missing
    {
        name: 'categories_image_col',
        sql: `
            ALTER TABLE \`categories\`
            ADD COLUMN IF NOT EXISTS \`image\` VARCHAR(500) DEFAULT NULL
            AFTER \`name\`;
        `
    },

    // SITECONFIG: add currency column if missing
    {
        name: 'siteconfig_currency_col',
        sql: `
            ALTER TABLE \`siteconfig\`
            ADD COLUMN IF NOT EXISTS \`currency\` VARCHAR(10) NOT NULL DEFAULT '£'
            AFTER \`email\`;
        `
    },

    // SITECONFIG: add deliveryCharge column if missing
    {
        name: 'siteconfig_delivery_col',
        sql: `
            ALTER TABLE \`siteconfig\`
            ADD COLUMN IF NOT EXISTS \`deliveryCharge\` DECIMAL(10,2) NOT NULL DEFAULT 20.00
            AFTER \`currency\`;
        `
    },

    // BRANDS
    {
        name: 'brands',
        sql: `
            CREATE TABLE IF NOT EXISTS \`brands\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`image\`      VARCHAR(500) DEFAULT NULL,
                \`sortOrder\`  INT(11)      NOT NULL DEFAULT 0,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_brand_name\` (\`name\`),
                INDEX \`idx_brand_active_sort\` (\`isActive\`, \`sortOrder\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // BRAND_CATEGORIES
    {
        name: 'brand_categories',
        sql: `
            CREATE TABLE IF NOT EXISTS \`brand_categories\` (
                \`id\`         INT(11) NOT NULL AUTO_INCREMENT,
                \`brandId\`    INT(11) NOT NULL,
                \`categoryId\` INT(11) NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_brand_cat\` (\`brandId\`, \`categoryId\`),
                INDEX \`idx_bc_brand\`    (\`brandId\`),
                INDEX \`idx_bc_category\` (\`categoryId\`),
                CONSTRAINT \`fk_bc_brand\`    FOREIGN KEY (\`brandId\`)    REFERENCES \`brands\`     (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`fk_bc_category\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // PRODUCTS
    {
        name: 'products',
        sql: `
            CREATE TABLE IF NOT EXISTS \`products\` (
                \`id\`          INT(11)        NOT NULL AUTO_INCREMENT,
                \`name\`        VARCHAR(500)   NOT NULL,
                \`slug\`        VARCHAR(500)   NOT NULL DEFAULT '',
                \`description\` LONGTEXT       DEFAULT NULL,
                \`price\`       DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
                \`salePrice\`   DECIMAL(10,2)  DEFAULT NULL,
                \`categoryId\`  INT(11)        DEFAULT NULL,
                \`brandId\`     INT(11)        DEFAULT NULL,
                \`images\`      JSON           DEFAULT NULL,
                \`variants\`    JSON           DEFAULT NULL,
                \`tags\`        JSON           DEFAULT NULL,
                \`avgRating\`   DECIMAL(3,2)   NOT NULL DEFAULT 0.00,
                \`reviewCount\` INT(11)        NOT NULL DEFAULT 0,
                \`isActive\`    TINYINT(1)     NOT NULL DEFAULT 1,
                \`sortOrder\`   INT(11)        NOT NULL DEFAULT 0,
                \`created_at\`  DATETIME       NOT NULL,
                \`updated_at\`  DATETIME       NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_prod_slug\`   (\`slug\`(191)),
                INDEX \`idx_prod_cat\`    (\`categoryId\`),
                INDEX \`idx_prod_brand\`  (\`brandId\`),
                INDEX \`idx_prod_active\` (\`isActive\`),
                CONSTRAINT \`fk_prod_cat\`   FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL,
                CONSTRAINT \`fk_prod_brand\` FOREIGN KEY (\`brandId\`)    REFERENCES \`brands\`     (\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // PRODUCT REVIEWS
    {
        name: 'product_reviews',
        sql: `
            CREATE TABLE IF NOT EXISTS \`product_reviews\` (
                \`id\`           INT(11)      NOT NULL AUTO_INCREMENT,
                \`productId\`    INT(11)      NOT NULL,
                \`reviewerName\` VARCHAR(255) NOT NULL,
                \`rating\`       TINYINT(1)   NOT NULL DEFAULT 5,
                \`title\`        VARCHAR(500) DEFAULT NULL,
                \`body\`         TEXT         DEFAULT NULL,
                \`isActive\`     TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\`   DATETIME     NOT NULL,
                \`updated_at\`   DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_rev_product\` (\`productId\`),
                CONSTRAINT \`fk_rev_product\` FOREIGN KEY (\`productId\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CUSTOMERS
    {
        name: 'customers',
        sql: `
            CREATE TABLE IF NOT EXISTS \`customers\` (
                \`id\`          INT(11)      NOT NULL AUTO_INCREMENT,
                \`firstName\`   VARCHAR(100) NOT NULL,
                \`lastName\`    VARCHAR(100) NOT NULL,
                \`email\`       VARCHAR(255) NOT NULL,
                \`password\`    VARCHAR(255) NOT NULL,
                \`mobile\`      VARCHAR(20)  DEFAULT NULL,
                \`dateOfBirth\` DATE         DEFAULT NULL,
                \`token\`       TEXT         DEFAULT NULL,
                \`isActive\`    TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\`  DATETIME     NOT NULL,
                \`updated_at\`  DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_customers_email\` (\`email\`),
                INDEX \`idx_cust_active\` (\`isActive\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CUSTOMER ADDRESSES
    {
        name: 'customer_addresses',
        sql: `
            CREATE TABLE IF NOT EXISTS \`customer_addresses\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`customerId\` INT(11)      NOT NULL,
                \`firstName\`  VARCHAR(100) NOT NULL,
                \`lastName\`   VARCHAR(100) NOT NULL,
                \`line1\`      VARCHAR(255) NOT NULL,
                \`line2\`      VARCHAR(255) DEFAULT NULL,
                \`city\`       VARCHAR(100) DEFAULT NULL,
                \`county\`     VARCHAR(100) DEFAULT NULL,
                \`postcode\`   VARCHAR(20)  NOT NULL,
                \`country\`    VARCHAR(100) NOT NULL DEFAULT 'United Kingdom',
                \`phone\`      VARCHAR(20)  DEFAULT NULL,
                \`isDefault\`  TINYINT(1)   NOT NULL DEFAULT 0,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_addr_customer\` (\`customerId\`),
                CONSTRAINT \`fk_addr_customer\` FOREIGN KEY (\`customerId\`)
                    REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // PAYMENT SETTINGS
    {
        name: 'payment_settings',
        sql: `
            CREATE TABLE IF NOT EXISTS \`payment_settings\` (
                \`id\`                INT(11)      NOT NULL AUTO_INCREMENT,
                \`razorpayKeyId\`     VARCHAR(255) DEFAULT NULL,
                \`razorpayKeySecret\` VARCHAR(255) DEFAULT NULL,
                \`isTestMode\`        TINYINT(1)   NOT NULL DEFAULT 1,
                \`isActive\`          TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\`        DATETIME     NOT NULL,
                \`updated_at\`        DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // ORDERS
    {
        name: 'orders',
        sql: `
            CREATE TABLE IF NOT EXISTS \`orders\` (
                \`id\`                INT(11)       NOT NULL AUTO_INCREMENT,
                \`customerId\`        INT(11)       NOT NULL,
                \`orderNumber\`       VARCHAR(100)  NOT NULL,
                \`items\`             JSON          NOT NULL,
                \`subtotal\`          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                \`deliveryCharge\`    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                \`total\`             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                \`deliveryAddress\`   JSON          DEFAULT NULL,
                \`contactPhone\`      VARCHAR(20)   DEFAULT NULL,
                \`paymentMethod\`     VARCHAR(50)   DEFAULT 'razorpay',
                \`paymentId\`         VARCHAR(255)  DEFAULT NULL,
                \`razorpayOrderId\`   VARCHAR(255)  DEFAULT NULL,
                \`razorpayPaymentId\` VARCHAR(255)  DEFAULT NULL,
                \`status\`            ENUM('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
                \`notes\`             TEXT          DEFAULT NULL,
                \`created_at\`        DATETIME      NOT NULL,
                \`updated_at\`        DATETIME      NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_order_number\` (\`orderNumber\`),
                INDEX \`idx_order_customer\` (\`customerId\`),
                INDEX \`idx_order_status\`   (\`status\`),
                CONSTRAINT \`fk_order_customer\` FOREIGN KEY (\`customerId\`)
                    REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // PROMO BANNERS
    {
        name: 'promo_banners',
        sql: `
            CREATE TABLE IF NOT EXISTS \`promo_banners\` (
                \`id\`             INT(11)      NOT NULL AUTO_INCREMENT,
                \`rowIndex\`       TINYINT(1)   NOT NULL,
                \`colIndex\`       TINYINT(1)   NOT NULL,
                \`url\`            VARCHAR(500) DEFAULT NULL,
                \`redirectionUrl\` VARCHAR(500) DEFAULT NULL,
                \`label\`          VARCHAR(255) DEFAULT NULL,
                \`isActive\`       TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\`     DATETIME     NOT NULL,
                \`updated_at\`     DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_promo_slot\` (\`rowIndex\`, \`colIndex\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CATEGORY PAGE CONFIG — hero + sections per root category
    {
        name: 'category_page_config',
        sql: `
            CREATE TABLE IF NOT EXISTS \`category_page_config\` (
                \`id\`         INT(11)  NOT NULL AUTO_INCREMENT,
                \`categoryId\` INT(11)  NOT NULL,
                \`config\`     LONGTEXT NOT NULL DEFAULT '{}',
                \`created_at\` DATETIME NOT NULL,
                \`updated_at\` DATETIME NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_catpage_cat\` (\`categoryId\`),
                CONSTRAINT \`fk_catpage_cat\` FOREIGN KEY (\`categoryId\`)
                    REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // POLICIES — CMS for Shipping, Returns, Privacy, Terms
    {
        name: 'policies',
        sql: `
            CREATE TABLE IF NOT EXISTS \`policies\` (
                \`id\`          INT(11)      NOT NULL AUTO_INCREMENT,
                \`slug\`        VARCHAR(100) NOT NULL,
                \`title\`       VARCHAR(255) NOT NULL,
                \`lastUpdated\` VARCHAR(100) DEFAULT NULL,
                \`sections\`    LONGTEXT     NOT NULL DEFAULT '[]',
                \`sortOrder\`   INT(11)      NOT NULL DEFAULT 0,
                \`created_at\`  DATETIME     NOT NULL,
                \`updated_at\`  DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_policy_slug\` (\`slug\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // FAQ CATEGORIES
    {
        name: 'faq_categories',
        sql: `
            CREATE TABLE IF NOT EXISTS \`faq_categories\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`icon\`       VARCHAR(100) DEFAULT NULL,
                \`sortOrder\`  INT(11)      NOT NULL DEFAULT 0,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // FAQ ARTICLES
    {
        name: 'faq_articles',
        sql: `
            CREATE TABLE IF NOT EXISTS \`faq_articles\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`categoryId\` INT(11)      NOT NULL,
                \`title\`      VARCHAR(500) NOT NULL,
                \`content\`    LONGTEXT     DEFAULT NULL,
                \`sortOrder\`  INT(11)      NOT NULL DEFAULT 0,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_faq_cat\` (\`categoryId\`),
                CONSTRAINT \`fk_faq_cat\` FOREIGN KEY (\`categoryId\`)
                    REFERENCES \`faq_categories\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CONTACT LEADS
    {
        name: 'contact_leads',
        sql: `
            CREATE TABLE IF NOT EXISTS \`contact_leads\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`email\`      VARCHAR(255) NOT NULL,
                \`phone\`      VARCHAR(30)  DEFAULT NULL,
                \`subject\`    VARCHAR(255) DEFAULT NULL,
                \`message\`    TEXT         NOT NULL,
                \`status\`     ENUM('new','read','replied','closed') NOT NULL DEFAULT 'new',
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_lead_status\` (\`status\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

];

async function initDB() {
    console.log('Checking database tables...');
    for (const table of tables) {
        try {
            await db.execute(table.sql);
            console.log(`   Table ready: ${table.name}`);
        } catch (err) {
            console.error(`   Failed: ${table.name} - ${err.message}`);
        }
    }

    // Seed default policy content if empty
    try {
        const Policy = require('../models/policyModel');
        await Policy.seedDefaults();
        console.log('   Policies seeded.');
    } catch (err) {
        console.error('   Policy seed failed:', err.message);
    }

    // Seed default FAQ content if empty
    try {
        const FAQ = require('../models/faqModel');
        await FAQ.seedDefaults();
        console.log('   FAQ seeded.');
    } catch (err) {
        console.error('   FAQ seed failed:', err.message);
    }

    console.log('Database init complete.\n');
}

module.exports = initDB;

