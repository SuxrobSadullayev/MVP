/**
 * ==========================================================================
 * ZOD SXEMALARI — API DTO va frontend forma validatsiyasi UCHUN BIR MANBA
 * --------------------------------------------------------------------------
 * TZ DM-11 / FR-API-04.
 * Server hech qachon client validatsiyasiga ISHONMAYDI — bu sxemalar
 * ikkala tomonda ham ishlaydi, lekin server tomonda MAJBURIY.
 * ========================================================================== */

import { z } from 'zod';
import {
  AREA_MAX_M2,
  AREA_MIN_M2,
  BUILD_YEAR_MIN,
  FLOOR_MAX,
  FLOOR_MIN,
  MIN_IMAGES,
  MIN_PANORAMAS,
  MAX_IMAGES,
  MAX_PANORAMAS,
  OTP_LENGTH,
  PAGE_SIZE,
  PAGE_SIZE_MAX,
  PRICE_MAX_UZS,
  PRICE_MIN_UZS,
  ROOMS_MAX,
  ROOMS_MIN,
  UZ_BOUNDS,
  UZ_PHONE_REGEX,
} from './constants.js';

// ==========================================================================
// ENUM'LAR — Prisma enum'lari bilan bir xil bo'lishi shart
// ==========================================================================

export const dealTypeSchema = z.enum(['sale', 'rent']);
export const propertyCategorySchema = z.enum([
  'new_building',
  'secondary',
  'cottage',
  'commercial',
]);
export const rentPeriodSchema = z.enum(['monthly', 'daily']);
export const languageSchema = z.enum(['uz', 'ru']);
export const sortSchema = z.enum(['newest', 'price_asc', 'price_desc', 'area_desc']);

// ==========================================================================
// ASOSIY TIPLAR
// ==========================================================================

/**
 * Raqam — matn ko'rinishida ham kelishi mumkin (forma, query string).
 * `Number()` ishlatiladi: `parseInt("1e9")` 1 qaytaradi, bu narxni buzadi.
 */
const numeric = z.union([z.number(), z.string()]).transform((v, ctx) => {
  const n = typeof v === 'number' ? v : Number(v.trim());
  if (!Number.isFinite(n)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Raqam noto'g'ri" });
    return z.NEVER;
  }
  return n;
});

export const phoneSchema = z
  .string()
  .transform((v) => {
    const digits = v.replace(/[^\d+]/g, '');
    return digits.startsWith('+') ? digits : `+${digits}`;
  })
  .refine((v) => UZ_PHONE_REGEX.test(v), {
    message: "Telefon raqam noto'g'ri. Misol: +998 90 123 45 67",
  });

export const latitudeSchema = numeric.pipe(
  z.number().min(UZ_BOUNDS.minLat).max(UZ_BOUNDS.maxLat),
);
export const longitudeSchema = numeric.pipe(
  z.number().min(UZ_BOUNDS.minLng).max(UZ_BOUNDS.maxLng),
);

// ==========================================================================
// AUTH — TZ FR-AUTH-01…05
// ==========================================================================

export const requestOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z
    .string()
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Kod ${OTP_LENGTH} xonali bo'lishi kerak`),
});

// ==========================================================================
// KATALOG FILTRI — TZ FR-CAT-03…09
// ==========================================================================

export const propertyFilterSchema = z
  .object({
    dealType: dealTypeSchema.default('sale'),
    regionId: numeric.pipe(z.number().int().positive()).optional(),
    districtId: numeric.pipe(z.number().int().positive()).optional(),
    category: propertyCategorySchema.optional(),

    priceMin: numeric.pipe(z.number().min(0)).optional(),
    priceMax: numeric.pipe(z.number().min(0)).optional(),
    areaMin: numeric.pipe(z.number().min(0)).optional(),
    areaMax: numeric.pipe(z.number().min(0)).optional(),

    /**
     * `4` → "4 va undan ko'p" (TZ FR-CAT-04).
     * Prototipda aniq tenglik edi va 5–6 xonalilar topilmasdi.
     */
    rooms: numeric.pipe(z.number().int().min(ROOMS_MIN).max(ROOMS_MAX)).optional(),

    hasPanorama: z.coerce.boolean().optional(),
    verifiedSellerOnly: z.coerce.boolean().optional(),

    q: z.string().trim().max(120).optional(),
    sort: sortSchema.default('newest'),

    page: numeric.pipe(z.number().int().min(1)).default(1),
    limit: numeric.pipe(z.number().int().min(1).max(PAGE_SIZE_MAX)).default(PAGE_SIZE),
  })
  .refine((v) => v.priceMin === undefined || v.priceMax === undefined || v.priceMin <= v.priceMax, {
    message: "Eng past narx eng yuqorisidan katta bo'la olmaydi",
    path: ['priceMin'],
  })
  .refine((v) => v.areaMin === undefined || v.areaMax === undefined || v.areaMin <= v.areaMax, {
    message: "Eng kichik maydon eng kattasidan katta bo'la olmaydi",
    path: ['areaMin'],
  });

export type PropertyFilter = z.infer<typeof propertyFilterSchema>;

/** Xarita viewport so'rovi — TZ FR-MAP-13 (hammasini birdan yuklamaydi) */
export const mapBoundsSchema = z
  .object({
    north: latitudeSchema,
    south: latitudeSchema,
    east: longitudeSchema,
    west: longitudeSchema,
  })
  .refine((v) => v.north > v.south, { message: "Chegara noto'g'ri" })
  .refine((v) => v.east > v.west, { message: "Chegara noto'g'ri" });

// ==========================================================================
// E'LON YARATISH — TZ FR-POST-01…16
// ==========================================================================

const propertyBase = z.object({
  title: z.string().trim().min(10, 'Kamida 10 belgi').max(80),
  description: z.string().trim().max(2000).optional(),

  dealType: dealTypeSchema,
  category: propertyCategorySchema,

  price: numeric.pipe(z.number().min(PRICE_MIN_UZS).max(PRICE_MAX_UZS)),
  area: numeric.pipe(z.number().min(AREA_MIN_M2).max(AREA_MAX_M2)),
  rooms: numeric.pipe(z.number().int().min(ROOMS_MIN).max(ROOMS_MAX)),

  /** Prototipda bu maydonlar YO'Q edi, 5/12 qotirilgan edi */
  floor: numeric.pipe(z.number().int().min(FLOOR_MIN).max(FLOOR_MAX)),
  totalFloors: numeric.pipe(z.number().int().min(FLOOR_MIN).max(FLOOR_MAX)),
  buildYear: numeric
    .pipe(z.number().int().min(BUILD_YEAR_MIN).max(new Date().getFullYear() + 5))
    .optional(),
  bathrooms: numeric.pipe(z.number().int().min(0).max(20)).optional(),

  regionId: numeric.pipe(z.number().int().positive()),
  districtId: numeric.pipe(z.number().int().positive()),
  address: z.string().trim().min(5).max(200),

  /** Majburiy — default YO'Q. Prototipda jimgina Toshkentga tushardi. */
  lat: latitudeSchema,
  lng: longitudeSchema,

  rentPeriod: rentPeriodSchema.optional(),
  depositRequired: numeric.pipe(z.number().min(0)).optional(),
  utilitiesIncluded: z.boolean().optional(),

  imageIds: z.array(z.string().uuid()).min(MIN_IMAGES, `Kamida ${MIN_IMAGES} ta surat`).max(MAX_IMAGES),
  /** Panoramasiz e'lon chop etilmaydi — mahsulotning asosiy va'dasi */
  panoramaIds: z
    .array(z.string().uuid())
    .min(MIN_PANORAMAS, 'Kamida bitta 360° panorama majburiy')
    .max(MAX_PANORAMAS),
});

export const createPropertySchema = propertyBase
  .refine((v) => v.floor <= v.totalFloors, {
    message: "Qavat binodagi qavatlar sonidan katta bo'la olmaydi",
    path: ['floor'],
  })
  .refine((v) => v.dealType !== 'rent' || v.rentPeriod !== undefined, {
    message: 'Ijara uchun muddat tanlanishi kerak',
    path: ['rentPeriod'],
  });

export type CreateProperty = z.infer<typeof createPropertySchema>;

export const updatePropertySchema = propertyBase.partial();
export type UpdateProperty = z.infer<typeof updatePropertySchema>;

// ==========================================================================
// MODERATSIYA — TZ FR-ADM-02
// ==========================================================================

export const moderationDecisionSchema = z
  .object({
    action: z.enum(['approve', 'reject', 'request_changes']),
    reason: z.string().trim().max(1000).optional(),
  })
  .refine((v) => v.action === 'approve' || (v.reason && v.reason.length >= 10), {
    message: 'Rad etish yoki tuzatish so\'rashda sabab majburiy (kamida 10 belgi)',
    path: ['reason'],
  });

// ==========================================================================
// AI — TZ §16
// ==========================================================================

/**
 * TZ SEC-AI-01 — `reject` ATAYLAB YO'Q.
 * AI e'lonni rad eta olmaydi, faqat tartiblaydi.
 */
export const moderationVerdictSchema = z.enum(['auto_approve', 'needs_review', 'flag']);

export const mediaModerationResultSchema = z.object({
  verdict: moderationVerdictSchema,
  confidence: z.number().min(0).max(1),
  reasons: z.array(
    z.enum([
      'blurry',
      'too_dark',
      'obstructed',
      'not_equirectangular',
      'duplicate',
      'contains_faces',
      'contains_plates',
      'inappropriate',
      'watermark',
      'low_resolution',
    ]),
  ),
  roomTag: z.string().max(40).optional(),
  altUz: z.string().max(200).optional(),
  altRu: z.string().max(200).optional(),
});

export type MediaModerationResult = z.infer<typeof mediaModerationResultSchema>;

/** TZ NFR-UX-22 — sotuvchi tasdig'i majburiy */
export const acceptAiGenerationSchema = z.object({
  generationId: z.string().uuid(),
  /** Sotuvchi tahrirlagan bo'lishi mumkin */
  editedUz: z.string().trim().max(2000).optional(),
  editedRu: z.string().trim().max(2000).optional(),
});

// ==========================================================================
// CHAT
// ==========================================================================

export const sendMessageSchema = z.object({
  chatId: z.string().uuid(),
  body: z.string().trim().min(1).max(4000),
});
