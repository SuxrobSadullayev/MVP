#!/usr/bin/env node
/**
 * ==========================================================================
 * HIMOYA: HTML da yo'q faylga havola bo'lmasin — TZ NFR-OPS-01
 * --------------------------------------------------------------------------
 * NIMA UCHUN BOR:
 * Prototip `src/style.css` ga havola qilardi, lekin bu fayl na diskda,
 * na git tarixida bor edi. Butun dizayn tizimi shu faylda edi.
 * Loyiha buzuq holda commit qilingan va hech narsa buni aniqlamagan —
 * sayt stilsiz oq HTML bo'lib ochilardi.
 *
 * Bu skript shu sinfdagi xatoni CI da ushlaydi.
 * ========================================================================== */

import { existsSync, readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const LOCAL_REF = /(?:href|src)\s*=\s*["']([^"'#?]+\.(?:css|js|mjs|png|jpg|jpeg|svg|webp|woff2?))["']/gi;

const problems = [];
let checked = 0;

for await (const file of glob('**/*.html', {
  exclude: (p) => p.includes('node_modules') || p.includes('.git') || p.includes('dist'),
})) {
  const html = readFileSync(file, 'utf8');
  const base = dirname(file);

  for (const match of html.matchAll(LOCAL_REF)) {
    const ref = match[1];
    // Tashqi havolalar bu skriptning ishi emas
    if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:')) continue;

    checked++;
    const target = resolve(base, ref);
    if (!existsSync(target)) {
      problems.push({ file, ref });
    }
  }
}

if (problems.length) {
  console.error('\n❌ Yo\'q faylga havola topildi\n');
  for (const p of problems) {
    console.error(`  ${p.file}`);
    console.error(`    → ${p.ref}  (fayl mavjud emas)\n`);
  }
  console.error('  Prototip aynan shu sababdan stilsiz ochilardi.\n');
  process.exit(1);
}

console.log(`✅ Havola himoyasi: ${checked} ta lokal havola tekshirildi, hammasi joyida`);
