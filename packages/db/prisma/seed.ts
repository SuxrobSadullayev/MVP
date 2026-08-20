/**
 * ==========================================================================
 * SEED — ma'lumotnoma jadvallari
 * --------------------------------------------------------------------------
 * IDEMPOTENT: qayta-qayta ishga tushirsa bo'ladi, dublikat yaratmaydi.
 * Faqat ma'lumotnoma (regions, districts) — sinov e'lonlari EMAS.
 *
 *   npm run db:seed
 * ========================================================================== */

import { PrismaClient } from '@prisma/client';
import { REGIONS } from './data/regions.js';

const prisma = new PrismaClient();

async function seedRegions(): Promise<void> {
  let regionCount = 0;
  let districtCount = 0;

  for (const r of REGIONS) {
    const region = await prisma.region.upsert({
      where: { code: r.code },
      update: {
        nameUzLatn: r.uz,
        nameUzCyrl: r.cyrl,
        nameRu: r.ru,
        centerLat: r.centerLat,
        centerLng: r.centerLng,
        searchAliases: r.aliases,
      },
      create: {
        code: r.code,
        nameUzLatn: r.uz,
        nameUzCyrl: r.cyrl,
        nameRu: r.ru,
        centerLat: r.centerLat,
        centerLng: r.centerLng,
        searchAliases: r.aliases,
      },
    });
    regionCount++;

    for (const d of r.districts) {
      await prisma.district.upsert({
        where: { regionId_code: { regionId: region.id, code: d.code } },
        update: { nameUzLatn: d.uz, nameUzCyrl: d.cyrl, nameRu: d.ru },
        create: {
          regionId: region.id,
          code: d.code,
          nameUzLatn: d.uz,
          nameUzCyrl: d.cyrl,
          nameRu: d.ru,
        },
      });
      districtCount++;
    }

    process.stdout.write(`  ${r.uz.padEnd(32)} ${String(r.districts.length).padStart(3)} tuman\n`);
  }

  console.log(`\n✅ ${regionCount} hudud, ${districtCount} tuman`);
}

/**
 * Ma'lumotnoma to'g'ri yozilganini tasdiqlash.
 * Seed "muvaffaqiyatli" deb aytishdan oldin haqiqatan tekshiriladi.
 */
async function verify(): Promise<void> {
  const regions = await prisma.region.count();
  const districts = await prisma.district.count();

  const problems: string[] = [];

  if (regions !== 14) problems.push(`hududlar soni ${regions}, 14 kutilgan`);

  // Har bir hududda kamida bitta tuman bo'lishi kerak
  const empty = await prisma.region.findMany({
    where: { districts: { none: {} } },
    select: { nameUzLatn: true },
  });
  if (empty.length) problems.push(`tumansiz hudud: ${empty.map((e) => e.nameUzLatn).join(', ')}`);

  // Uchala yozuv ham to'ldirilganmi
  const blank = await prisma.region.count({
    where: { OR: [{ nameUzCyrl: '' }, { nameRu: '' }, { nameUzLatn: '' }] },
  });
  if (blank) problems.push(`${blank} ta hududda nom yozuvi bo'sh`);

  // Koordinatalar O'zbekiston chegarasida
  const outside = await prisma.$queryRaw<Array<{ name_uz_latn: string }>>`
    SELECT name_uz_latn FROM regions
    WHERE center_lat NOT BETWEEN 37.0 AND 45.7
       OR center_lng NOT BETWEEN 55.9 AND 73.2
  `;
  if (outside.length) {
    problems.push(`chegaradan tashqari: ${outside.map((o) => o.name_uz_latn).join(', ')}`);
  }

  // FR-CAT-08: markaz shahar nomi bilan topilishi SHART.
  // Seed dan oldin 13 tadan 7 tasi topilmasdi.
  const cityQueries = ['Бухара','Фергана','Карши','Гулистан','Термез','Ургенч','Нукус',
                       'Bukhara','Samarkand','Tashkent','Fergana','Termez','Urgench','Nukus'];
  const notFound: string[] = [];
  for (const q of cityQueries) {
    const hit = await prisma.region.findFirst({
      where: {
        OR: [
          { nameUzLatn: { contains: q, mode: 'insensitive' } },
          { nameUzCyrl: { contains: q, mode: 'insensitive' } },
          { nameRu:     { contains: q, mode: 'insensitive' } },
          { searchAliases: { has: q } },
        ],
      },
      select: { id: true },
    });
    if (!hit) notFound.push(q);
  }
  if (notFound.length) problems.push(`markaz shahar nomi bilan topilmadi: ${notFound.join(', ')}`);

  if (problems.length) {
    console.error('\n❌ Tekshiruv yiqildi:');
    problems.forEach((p) => console.error(`   • ${p}`));
    process.exitCode = 1;
    return;
  }

  console.log(`✅ Tekshiruv: ${regions} hudud, ${districts} tuman — hammasi joyida`);
}

async function main(): Promise<void> {
  console.log('\n📍 Hududiy ma\'lumotnoma yuklanmoqda...\n');
  await seedRegions();
  await verify();
}

main()
  .catch((e) => {
    console.error('\n❌ Seed yiqildi:', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
