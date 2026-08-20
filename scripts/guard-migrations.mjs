#!/usr/bin/env node
/**
 * ==========================================================================
 * HIMOYA: migratsiya geo qatlamini o'chirmasin — TZ NFR-OPS-01
 * --------------------------------------------------------------------------
 * NIMA UCHUN BOR:
 * `properties.geom` va `pois.geom` — GENERATED ustunlar, GiST va trigram
 * indekslari bilan birga. Agar kimdir sxemada `geom` e'lonini olib tashlasa,
 * `prisma migrate diff` jimgina quyidagini yozadi:
 *
 *     ALTER TABLE "properties" DROP COLUMN "geom";
 *     DROP INDEX "properties_geom_idx";
 *
 * Bu butun geo qatlamini yo'q qiladi — POI radiusi va xarita bbox so'rovlari
 * full-table scan bo'lib qoladi. Bir marta haqiqatan sodir bo'lgan.
 *
 * Ustiga, generated ustunga `ALTER COLUMN ... DROP DEFAULT` yozilsa,
 * PostgreSQL xato beradi va deploy o'rtada yiqiladi.
 * ========================================================================== */

import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';

const FORBIDDEN = [
  { pattern: /DROP\s+COLUMN\s+"?geom"?/i, why: 'geo ustunini o\'chiradi' },
  { pattern: /DROP\s+INDEX\s+"?\w*geom\w*"?/i, why: 'GiST geo-indeksini o\'chiradi' },
  { pattern: /DROP\s+EXTENSION\s+.*postgis/i, why: 'PostGIS kengaytmasini o\'chiradi' },
  {
    pattern: /ALTER\s+COLUMN\s+"?geom"?\s+DROP\s+DEFAULT/i,
    why: 'generated ustunda xato beradi — deploy yiqiladi',
  },
  { pattern: /DROP\s+INDEX\s+"?\w*trgm\w*"?/i, why: 'trigram qidiruv indeksini o\'chiradi' },
];

const problems = [];

for await (const file of glob('packages/db/prisma/migrations/**/migration.sql')) {
  const sql = readFileSync(file, 'utf8');
  for (const line of sql.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) continue;
    for (const { pattern, why } of FORBIDDEN) {
      if (pattern.test(trimmed)) {
        problems.push({ file, line: trimmed, why });
      }
    }
  }
}

if (problems.length) {
  console.error('\n❌ Migratsiya himoyasi ishga tushdi\n');
  for (const p of problems) {
    console.error(`  ${p.file}`);
    console.error(`    ${p.line}`);
    console.error(`    → ${p.why}\n`);
  }
  console.error('  Sabab odatda: sxemada `geom` yoki indeks e\'loni olib tashlangan.');
  console.error('  packages/db/README.md → "TUZOQ: Prisma va xom SQL obyektlari"\n');
  process.exit(1);
}

console.log('✅ Migratsiya himoyasi: geo qatlamiga tegilmagan');
