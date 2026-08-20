/**
 * ==========================================================================
 * REGRESSIYA TESTLARI — TZ §10.1
 * --------------------------------------------------------------------------
 * Har bir test prototipdagi HAQIQIY xatoga bog'langan.
 * Maqsad: o'sha xato qaytib kelsa, CI darhol yiqilsin.
 * ========================================================================== */

import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  calculateDeposit,
  isInsideUzbekistan,
  isValidPanoramaSize,
  matchesRoomsFilter,
  metersToWalkMinutes,
  normalizePhone,
  parseNumeric,
} from '../constants.js';
import {
  createPropertySchema,
  moderationDecisionSchema,
  moderationVerdictSchema,
  propertyFilterSchema,
} from '../schemas.js';

// --------------------------------------------------------------------------
// REG-03 — "4+ xonali" filtri
// Prototip: `p.rooms.toString() !== roomsVal` (aniq tenglik).
// Natija: 5 va 6 xonali uylar "4+" filtrida hech qachon chiqmasdi.
// --------------------------------------------------------------------------
describe("REG-03 — '4+ xonali' filtri", () => {
  it('4 xonali topiladi', () => {
    expect(matchesRoomsFilter(4, 4)).toBe(true);
  });

  it('5 va 6 xonali ham topiladi — prototipda topilmasdi', () => {
    expect(matchesRoomsFilter(5, 4)).toBe(true);
    expect(matchesRoomsFilter(6, 4)).toBe(true);
    expect(matchesRoomsFilter(12, 4)).toBe(true);
  });

  it('3 xonali "4+" ga tushmaydi', () => {
    expect(matchesRoomsFilter(3, 4)).toBe(false);
  });

  it("4 dan kichik filtrlar ANIQ tenglik bo'lib qoladi", () => {
    expect(matchesRoomsFilter(2, 2)).toBe(true);
    expect(matchesRoomsFilter(3, 2)).toBe(false);
  });
});

// --------------------------------------------------------------------------
// REG-07 — raqamni o'qish
// Prototip: parseInt("1e9") === 1  →  1 mlrd so'mlik uy 1 so'mga aylanardi
// --------------------------------------------------------------------------
describe('REG-07 — narxni raqamga aylantirish', () => {
  it('eksponensial yozuvni to\'g\'ri o\'qiydi (parseInt buzardi)', () => {
    expect(parseNumeric('1e9')).toBe(1_000_000_000);
    // Prototipdagi xatti-harakat, taqqoslash uchun:
    expect(Number.parseInt('1e9', 10)).toBe(1);
  });

  it('oddiy raqamlar', () => {
    expect(parseNumeric('1240000000')).toBe(1_240_000_000);
    expect(parseNumeric(96)).toBe(96);
    expect(parseNumeric('  42  ')).toBe(42);
  });

  it('yaroqsiz kiritmalar null qaytaradi', () => {
    expect(parseNumeric('abc')).toBeNull();
    expect(parseNumeric('')).toBeNull();
    expect(parseNumeric(Number.NaN)).toBeNull();
    expect(parseNumeric(Number.POSITIVE_INFINITY)).toBeNull();
  });

  it('sxema manfiy narxni rad etadi', () => {
    const base = validProperty();
    const r = createPropertySchema.safeParse({ ...base, price: -5000 });
    expect(r.success).toBe(false);
  });
});

// --------------------------------------------------------------------------
// REG-05/06 — majburiy joylashuv va qavat
// Prototip: lat/lng belgilanmasa jimgina Toshkentga tushardi;
//           qavat 5/12 qotirilgan edi va hech narsa tekshirmasdi.
// --------------------------------------------------------------------------
describe('REG-05 — joylashuv chegarasi', () => {
  it('O\'zbekiston ichidagi nuqta qabul qilinadi', () => {
    expect(isInsideUzbekistan(39.6547, 66.9597)).toBe(true); // Samarqand
    expect(isInsideUzbekistan(42.4531, 59.6103)).toBe(true); // Nukus
  });

  it('London rad etiladi', () => {
    expect(isInsideUzbekistan(51.5, -0.12)).toBe(false);
  });

  it("sxema chegaradan tashqari koordinatani rad etadi", () => {
    const r = createPropertySchema.safeParse({ ...validProperty(), lat: 51.5, lng: -0.12 });
    expect(r.success).toBe(false);
  });

  it('lat yoki lng yo\'q bo\'lsa rad etiladi — default YO\'Q', () => {
    const { lat: _lat, ...noLat } = validProperty();
    expect(createPropertySchema.safeParse(noLat).success).toBe(false);
  });
});

describe('REG-06 — qavat', () => {
  it('9 qavatli binoning 15-qavati rad etiladi', () => {
    const r = createPropertySchema.safeParse({ ...validProperty(), floor: 15, totalFloors: 9 });
    expect(r.success).toBe(false);
  });

  it("to'g'ri qavat o'tadi", () => {
    const r = createPropertySchema.safeParse({ ...validProperty(), floor: 4, totalFloors: 9 });
    expect(r.success).toBe(true);
  });
});

// --------------------------------------------------------------------------
// FR-POST-03 — panorama majburiy (mahsulotning asosiy va'dasi)
// --------------------------------------------------------------------------
describe('FR-POST-03 — majburiy panorama', () => {
  it('panoramasiz e\'lon rad etiladi', () => {
    const r = createPropertySchema.safeParse({ ...validProperty(), panoramaIds: [] });
    expect(r.success).toBe(false);
  });

  it('3 tadan kam surat rad etiladi', () => {
    const r = createPropertySchema.safeParse({ ...validProperty(), imageIds: [uuid(), uuid()] });
    expect(r.success).toBe(false);
  });

  it('panorama o\'lchami tekshiriladi', () => {
    expect(isValidPanoramaSize(4000, 2000)).toBe(true);
    expect(isValidPanoramaSize(6000, 3000)).toBe(true);
    expect(isValidPanoramaSize(1920, 1080)).toBe(false); // kichik + nisbat 16:9
    expect(isValidPanoramaSize(4000, 4000)).toBe(false); // nisbat 1:1
  });
});

// --------------------------------------------------------------------------
// REG-21 / FR-MAP-05 — POI radiusi
// Prototip: Samarqanddagi uyga Toshkent maktabi "yaqin" deb ko'rsatilardi
// --------------------------------------------------------------------------
describe('FR-MAP-07 — piyoda vaqti', () => {
  it('80 m/daq bo\'yicha hisoblanadi', () => {
    expect(metersToWalkMinutes(280)).toBe(4);
    expect(metersToWalkMinutes(150)).toBe(2);
  });

  it('minimum 1 daqiqa', () => {
    expect(metersToWalkMinutes(10)).toBe(1);
    expect(metersToWalkMinutes(0)).toBe(1);
  });
});

// --------------------------------------------------------------------------
// REG-17 / FR-PAY-02 — avans uy narxiga mutanosib
// Prototip: har doim 10 000 000 so'm, uy narxidan qat'i nazar
// --------------------------------------------------------------------------
describe('FR-PAY-02 — avans mutanosib', () => {
  it('turli narxlar turli avans beradi — prototipda bir xil edi', () => {
    const cheap = calculateDeposit(780_000_000);
    const expensive = calculateDeposit(2_800_000_000);
    expect(cheap).not.toBe(expensive);
    expect(expensive).toBeGreaterThan(cheap);
  });

  it('chegaralar hurmat qilinadi', () => {
    expect(calculateDeposit(1_000_000)).toBe(1_000_000); // min
    expect(calculateDeposit(999_000_000_000)).toBe(50_000_000); // max
  });
});

// --------------------------------------------------------------------------
// SEC-AI-01 — AI e'lonni RAD ETA OLMAYDI
// --------------------------------------------------------------------------
describe('SEC-AI-01 — AI qarori', () => {
  it("'reject' hukmi umuman mavjud emas", () => {
    expect(moderationVerdictSchema.safeParse('reject').success).toBe(false);
    expect(moderationVerdictSchema.options).toEqual(['auto_approve', 'needs_review', 'flag']);
  });
});

// --------------------------------------------------------------------------
// REG-18 / FR-ADM-02 — rad etishda sabab majburiy
// --------------------------------------------------------------------------
describe('FR-ADM-02 — moderator sababi', () => {
  it('sababsiz rad etish qabul qilinmaydi', () => {
    expect(moderationDecisionSchema.safeParse({ action: 'reject' }).success).toBe(false);
    expect(
      moderationDecisionSchema.safeParse({ action: 'reject', reason: 'qisqa' }).success,
    ).toBe(false);
  });

  it('sabab bilan rad etish o\'tadi', () => {
    const r = moderationDecisionSchema.safeParse({
      action: 'reject',
      reason: 'Panorama boshqa uyga tegishli',
    });
    expect(r.success).toBe(true);
  });

  it('tasdiqlashda sabab shart emas', () => {
    expect(moderationDecisionSchema.safeParse({ action: 'approve' }).success).toBe(true);
  });
});

// --------------------------------------------------------------------------
// FR-AUTH-02 — telefon normalizatsiyasi
// --------------------------------------------------------------------------
describe('FR-AUTH-02 — telefon', () => {
  it('turli yozuvlarni bir ko\'rinishga keltiradi', () => {
    expect(normalizePhone('+998 90 123 45 67')).toBe('+998901234567');
    expect(normalizePhone('998901234567')).toBe('+998901234567');
    expect(normalizePhone('(+998) 90-123-45-67')).toBe('+998901234567');
  });

  it('noto\'g\'ri raqamni rad etadi', () => {
    expect(normalizePhone('+7 900 123 45 67')).toBeNull();
    expect(normalizePhone('90123456')).toBeNull();
    expect(normalizePhone('salom')).toBeNull();
  });
});

// --------------------------------------------------------------------------
// FR-CAT-03 — filtr mantiqi
// --------------------------------------------------------------------------
describe('FR-CAT-03 — katalog filtri', () => {
  it('narx oralig\'i teskari bo\'lsa rad etiladi', () => {
    const r = propertyFilterSchema.safeParse({ priceMin: 900, priceMax: 100 });
    expect(r.success).toBe(false);
  });

  it('sukut qiymatlari qo\'llanadi', () => {
    const r = propertyFilterSchema.parse({});
    expect(r.page).toBe(1);
    expect(r.limit).toBe(24);
    expect(r.sort).toBe('newest');
    expect(r.dealType).toBe('sale');
  });

  it('query string dagi matn raqamga aylanadi', () => {
    const r = propertyFilterSchema.parse({ page: '3', limit: '12', regionId: '10' });
    expect(r.page).toBe(3);
    expect(r.limit).toBe(12);
    expect(r.regionId).toBe(10);
  });
});

// --------------------------------------------------------------------------
// Yordamchilar
// --------------------------------------------------------------------------

function uuid(): string {
  return randomUUID();
}

function validProperty() {
  return {
    title: 'Registon yaqinida 3 xonali kvartira',
    dealType: 'sale' as const,
    category: 'secondary' as const,
    price: 1_240_000_000,
    area: 96,
    rooms: 3,
    floor: 4,
    totalFloors: 9,
    regionId: 10,
    districtId: 101,
    address: "Registon ko'chasi 14",
    lat: 39.6547,
    lng: 66.9597,
    imageIds: [uuid(), uuid(), uuid()],
    panoramaIds: [uuid()],
  };
}
