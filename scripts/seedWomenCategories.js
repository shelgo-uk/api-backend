/**
 * Seed Women category tree — mirrors next.co.uk Women mega menu
 * Run: node API/scripts/seedWomenCategories.js
 *
 * Assumes Women root category already exists with id = 1
 * All new categories are inserted as children of id=1 (level1)
 * or children of level1 (level2)
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');

const WOMEN_ID = 1;

// ── Level 1 → Level 2 structure ──────────────────────────────────────────────
const structure = [
  {
    name: 'Clothing', sortOrder: 1,
    children: [
      'All Clothing', 'Blazers', 'Blouses & Shirts', 'Coats & Jackets',
      'Co-ords', 'Dresses', 'Fleeces', 'Hoodies & Sweatshirts', 'Jeans',
      'Jumpers & Cardigans', 'Jumpsuits & Playsuits', 'Leggings & Joggers',
      'Shorts', 'Skirts', 'Sportswear', 'Swim & Beachwear',
      'Tops & T-Shirts', 'Trousers'
    ]
  },
  {
    name: 'Dresses', sortOrder: 2,
    children: [
      'All Dresses', 'Occasion Dresses', 'Wedding Guest Dresses', 'Summer Dresses'
    ]
  },
  {
    name: 'Workwear & Tailoring', sortOrder: 3,
    children: [
      'All Workwear', 'Suits & Tailoring'
    ]
  },
  {
    name: 'Holiday Shop', sortOrder: 4,
    children: [
      'All Holiday Shop', 'Swimwear', 'The Linen Collection'
    ]
  },
  {
    name: 'Footwear', sortOrder: 5,
    children: [
      'All Footwear', 'Boots', 'Flats', 'Heels',
      'Sandals & Wedges', 'Trainers'
    ]
  },
  {
    name: 'Lingerie', sortOrder: 6,
    children: [
      'All Lingerie', 'Bras', 'Knickers', 'Shapewear', 'Socks & Tights'
    ]
  },
  {
    name: 'Pyjamas & Nightwear', sortOrder: 7,
    children: [
      'All Nightwear', 'Pyjamas', 'Loungewear', 'Dressing Gowns', 'Slippers'
    ]
  },
  {
    name: 'Accessories', sortOrder: 8,
    children: [
      'All Accessories', 'Bags & Purses', 'Belts',
      'Jewellery & Watches', 'Sunglasses', 'Luggage'
    ]
  },
  {
    name: 'Trending', sortOrder: 9,
    children: [
      'May Top Picks', 'Trending on Social', 'Linen Collection',
      'Polka Dots', 'Summer Textures', 'Jeans & a Nice Top',
      'Coastal Prints', 'Capsule Wardrobe', 'Festival',
      'Graphic Styles', 'Summer Footwear', 'The Eid Collection',
      'National Trust x NEXT'
    ]
  },
  {
    name: 'Shop By Body Fit', sortOrder: 10,
    children: [
      'Plus Size & Curve', 'Maternity', 'Petite', 'Tall'
    ]
  },
  {
    name: 'Beauty', sortOrder: 11,
    children: [
      'Shop All'
    ]
  },
  {
    name: 'Luxury Brands', sortOrder: 12,
    children: [
      'Luxury Brands at SEASONS.co.uk', 'adidas originals', 'Coach',
      'GANNI', 'Rixo', 'Varley', 'Mulberry'
    ]
  },
  {
    name: 'Shop By Brand', sortOrder: 13,
    children: [
      'A-Z Brands', 'Adidas', 'Friends Like These', 'Lipsy',
      'Love & Roses', 'Next', 'Nike', 'Pour Moi', 'REISS',
      'Russell & Bromley', 'Self', 'THE SET', 'Yours Curve'
    ]
  },
];

async function seed() {
  console.log('🌱 Seeding Women category tree...\n');

  let level1Count = 0;
  let level2Count = 0;

  for (const group of structure) {
    // Insert level-1 category (child of Women)
    const [l1Result] = await db.execute(
      `INSERT INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
       VALUES (?, ?, ?, 1, NOW(), NOW())
       ON DUPLICATE KEY UPDATE sortOrder = VALUES(sortOrder), updated_at = NOW()`,
      [group.name, WOMEN_ID, group.sortOrder]
    );

    // Get the id (either inserted or existing)
    let l1Id;
    if (l1Result.insertId && l1Result.insertId > 0) {
      l1Id = l1Result.insertId;
      level1Count++;
    } else {
      // Already exists — fetch id
      const [existing] = await db.execute(
        `SELECT id FROM categories WHERE name = ? AND parentId = ?`,
        [group.name, WOMEN_ID]
      );
      l1Id = existing[0]?.id;
    }

    if (!l1Id) {
      console.warn(`  ⚠ Could not get id for "${group.name}", skipping children`);
      continue;
    }

    console.log(`  ✓ Level 1: ${group.name} (id=${l1Id})`);

    // Insert level-2 children
    for (let i = 0; i < group.children.length; i++) {
      const childName = group.children[i];
      await db.execute(
        `INSERT INTO categories (name, parentId, sortOrder, isActive, created_at, updated_at)
         VALUES (?, ?, ?, 1, NOW(), NOW())
         ON DUPLICATE KEY UPDATE sortOrder = VALUES(sortOrder), updated_at = NOW()`,
        [childName, l1Id, i + 1]
      );
      level2Count++;
      console.log(`      → ${childName}`);
    }
  }

  console.log(`\n✅ Done! Inserted/updated ${level1Count} level-1 and ${level2Count} level-2 categories.`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
