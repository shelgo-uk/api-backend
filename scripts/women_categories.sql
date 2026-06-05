-- ============================================================
-- Women Category Tree — mirrors next.co.uk Women mega menu
-- Women root category id = 1
-- Run this in your MySQL client / phpMyAdmin
-- Uses INSERT IGNORE to skip duplicates safely
-- ============================================================

SET NAMES utf8mb4;

-- ── LEVEL 1 (direct children of Women id=1) ──────────────────

INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at) VALUES
('Clothing',             1,  1, 1, NOW(), NOW()),
('Dresses',              1,  2, 1, NOW(), NOW()),
('Workwear & Tailoring', 1,  3, 1, NOW(), NOW()),
('Holiday Shop',         1,  4, 1, NOW(), NOW()),
('Footwear',             1,  5, 1, NOW(), NOW()),
('Lingerie',             1,  6, 1, NOW(), NOW()),
('Pyjamas & Nightwear',  1,  7, 1, NOW(), NOW()),
('Accessories',          1,  8, 1, NOW(), NOW()),
('Trending',             1,  9, 1, NOW(), NOW()),
('Shop By Body Fit',     1, 10, 1, NOW(), NOW()),
('Beauty',               1, 11, 1, NOW(), NOW()),
('Luxury Brands',        1, 12, 1, NOW(), NOW()),
('Shop By Brand',        1, 13, 1, NOW(), NOW());

-- ── LEVEL 2 — Clothing ───────────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'All Clothing'          AS name,  1 AS sortOrder UNION ALL
  SELECT 'Blazers',                         2 UNION ALL
  SELECT 'Blouses & Shirts',                3 UNION ALL
  SELECT 'Coats & Jackets',                 4 UNION ALL
  SELECT 'Co-ords',                         5 UNION ALL
  SELECT 'Dresses',                         6 UNION ALL
  SELECT 'Fleeces',                         7 UNION ALL
  SELECT 'Hoodies & Sweatshirts',           8 UNION ALL
  SELECT 'Jeans',                           9 UNION ALL
  SELECT 'Jumpers & Cardigans',            10 UNION ALL
  SELECT 'Jumpsuits & Playsuits',          11 UNION ALL
  SELECT 'Leggings & Joggers',             12 UNION ALL
  SELECT 'Shorts',                         13 UNION ALL
  SELECT 'Skirts',                         14 UNION ALL
  SELECT 'Sportswear',                     15 UNION ALL
  SELECT 'Swim & Beachwear',               16 UNION ALL
  SELECT 'Tops & T-Shirts',                17 UNION ALL
  SELECT 'Trousers',                       18
) c
JOIN categories p ON p.name = 'Clothing' AND p.parentId = 1;

-- ── LEVEL 2 — Dresses ────────────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'All Dresses'            AS name, 1 AS sortOrder UNION ALL
  SELECT 'Occasion Dresses',               2 UNION ALL
  SELECT 'Wedding Guest Dresses',          3 UNION ALL
  SELECT 'Summer Dresses',                 4
) c
JOIN categories p ON p.name = 'Dresses' AND p.parentId = 1;

-- ── LEVEL 2 — Workwear & Tailoring ───────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'All Workwear'           AS name, 1 AS sortOrder UNION ALL
  SELECT 'Suits & Tailoring',              2
) c
JOIN categories p ON p.name = 'Workwear & Tailoring' AND p.parentId = 1;

-- ── LEVEL 2 — Holiday Shop ───────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'All Holiday Shop'       AS name, 1 AS sortOrder UNION ALL
  SELECT 'Swimwear',                       2 UNION ALL
  SELECT 'The Linen Collection',           3
) c
JOIN categories p ON p.name = 'Holiday Shop' AND p.parentId = 1;

-- ── LEVEL 2 — Footwear ───────────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'All Footwear'           AS name, 1 AS sortOrder UNION ALL
  SELECT 'Boots',                          2 UNION ALL
  SELECT 'Flats',                          3 UNION ALL
  SELECT 'Heels',                          4 UNION ALL
  SELECT 'Sandals & Wedges',               5 UNION ALL
  SELECT 'Trainers',                       6
) c
JOIN categories p ON p.name = 'Footwear' AND p.parentId = 1;

-- ── LEVEL 2 — Lingerie ───────────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'All Lingerie'           AS name, 1 AS sortOrder UNION ALL
  SELECT 'Bras',                           2 UNION ALL
  SELECT 'Knickers',                       3 UNION ALL
  SELECT 'Shapewear',                      4 UNION ALL
  SELECT 'Socks & Tights',                 5
) c
JOIN categories p ON p.name = 'Lingerie' AND p.parentId = 1;

-- ── LEVEL 2 — Pyjamas & Nightwear ────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'All Nightwear'          AS name, 1 AS sortOrder UNION ALL
  SELECT 'Pyjamas',                        2 UNION ALL
  SELECT 'Loungewear',                     3 UNION ALL
  SELECT 'Dressing Gowns',                 4 UNION ALL
  SELECT 'Slippers',                       5
) c
JOIN categories p ON p.name = 'Pyjamas & Nightwear' AND p.parentId = 1;

-- ── LEVEL 2 — Accessories ────────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'All Accessories'        AS name, 1 AS sortOrder UNION ALL
  SELECT 'Bags & Purses',                  2 UNION ALL
  SELECT 'Belts',                          3 UNION ALL
  SELECT 'Jewellery & Watches',            4 UNION ALL
  SELECT 'Sunglasses',                     5 UNION ALL
  SELECT 'Luggage',                        6
) c
JOIN categories p ON p.name = 'Accessories' AND p.parentId = 1;

-- ── LEVEL 2 — Trending ───────────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'May Top Picks'          AS name,  1 AS sortOrder UNION ALL
  SELECT 'Trending on Social',              2 UNION ALL
  SELECT 'Linen Collection',                3 UNION ALL
  SELECT 'Polka Dots',                      4 UNION ALL
  SELECT 'Summer Textures',                 5 UNION ALL
  SELECT 'Jeans & a Nice Top',              6 UNION ALL
  SELECT 'Coastal Prints',                  7 UNION ALL
  SELECT 'Capsule Wardrobe',                8 UNION ALL
  SELECT 'Festival',                        9 UNION ALL
  SELECT 'Graphic Styles',                 10 UNION ALL
  SELECT 'Summer Footwear',                11 UNION ALL
  SELECT 'The Eid Collection',             12 UNION ALL
  SELECT 'National Trust x NEXT',          13
) c
JOIN categories p ON p.name = 'Trending' AND p.parentId = 1;

-- ── LEVEL 2 — Shop By Body Fit ───────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'Plus Size & Curve'      AS name, 1 AS sortOrder UNION ALL
  SELECT 'Maternity',                      2 UNION ALL
  SELECT 'Petite',                         3 UNION ALL
  SELECT 'Tall',                           4
) c
JOIN categories p ON p.name = 'Shop By Body Fit' AND p.parentId = 1;

-- ── LEVEL 2 — Beauty ─────────────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'Shop All'               AS name, 1 AS sortOrder
) c
JOIN categories p ON p.name = 'Beauty' AND p.parentId = 1;

-- ── LEVEL 2 — Luxury Brands ──────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'Luxury Brands at SEASONS.co.uk' AS name, 1 AS sortOrder UNION ALL
  SELECT 'adidas originals',                        2 UNION ALL
  SELECT 'Coach',                                   3 UNION ALL
  SELECT 'GANNI',                                   4 UNION ALL
  SELECT 'Rixo',                                    5 UNION ALL
  SELECT 'Varley',                                  6 UNION ALL
  SELECT 'Mulberry',                                7
) c
JOIN categories p ON p.name = 'Luxury Brands' AND p.parentId = 1;

-- ── LEVEL 2 — Shop By Brand ──────────────────────────────────
INSERT IGNORE INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
SELECT c.name, p.id, c.sortOrder, 1, NOW(), NOW()
FROM (
  SELECT 'A-Z Brands'             AS name,  1 AS sortOrder UNION ALL
  SELECT 'Adidas',                           2 UNION ALL
  SELECT 'Friends Like These',               3 UNION ALL
  SELECT 'Lipsy',                            4 UNION ALL
  SELECT 'Love & Roses',                     5 UNION ALL
  SELECT 'Next',                             6 UNION ALL
  SELECT 'Nike',                             7 UNION ALL
  SELECT 'Pour Moi',                         8 UNION ALL
  SELECT 'REISS',                            9 UNION ALL
  SELECT 'Russell & Bromley',               10 UNION ALL
  SELECT 'Self',                            11 UNION ALL
  SELECT 'THE SET',                         12 UNION ALL
  SELECT 'Yours Curve',                     13
) c
JOIN categories p ON p.name = 'Shop By Brand' AND p.parentId = 1;

-- ── Verify ────────────────────────────────────────────────────
SELECT
  p.name AS level1,
  COUNT(c.id) AS child_count
FROM categories p
LEFT JOIN categories c ON c.parentId = p.id
WHERE p.parentId = 1
GROUP BY p.id, p.name
ORDER BY p.sortOrder;
