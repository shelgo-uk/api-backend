/**
 * Backfill avgRating (3.5–5.0) and reviewCount for products that have none set.
 * Run: node scripts/seedProductRatings.js
 */
require('dotenv').config();
const db = require('../config/db');

function hash(id, salt = 0) {
  const x = Math.abs(((id * 9301 + 49297 + salt * 7919) | 0) % 233280);
  return x / 233280;
}

async function run() {
  const [products] = await db.execute(
    `SELECT id, avgRating, reviewCount FROM products WHERE isActive = 1`
  );

  let updated = 0;
  for (const p of products) {
    const rating = parseFloat(p.avgRating) || 0;
    const count = Number(p.reviewCount) || 0;
    if (rating > 0 && count > 0) continue;

    const h1 = hash(p.id, 1);
    const h2 = hash(p.id, 2);
    const avgRating = Math.round((3.5 + h1 * 1.5) * 10) / 10;
    const reviewCount = Math.floor(18 + h2 * 302);

    await db.execute(
      `UPDATE products SET avgRating = ?, reviewCount = ?, updated_at = NOW() WHERE id = ?`,
      [avgRating, reviewCount, p.id]
    );
    updated++;
  }

  console.log(`Updated ${updated} product(s) with ratings.`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
