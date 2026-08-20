/**
 * ==========================================================================
 * BIZNES QOIDALARI — yagona manba (TZ DM-11)
 * --------------------------------------------------------------------------
 * Bu raqamlar backend, frontend va testlarda BIR JOYDAN keladi.
 * Prototipdagi kasallik shu edi: 2000 metr bir joyda, 80 m/daq boshqa joyda,
 * 12600 kurs uchinchi joyda qotirilgan edi.
 * ========================================================================== */

// --- Infratuzilma masofasi (TZ FR-MAP-05…07) ------------------------------

/** Undan uzoq obyekt "yaqin-atrofdagi infratuzilma" emas */
export const POI_RADIUS_METERS = 2000;

/** Har turdan eng yaqin nechtasi ko'rsatiladi */
export const POI_MAX_PER_TYPE = 3;

/** Jami nechta POI ko'rsatiladi */
export const POI_MAX_TOTAL = 12;

/** Piyoda yurish tezligi. To'g'ri chiziq bo'yicha — UI da "~" bilan */
export const WALK_SPEED_M_PER_MIN = 80;

/** Metrni piyoda daqiqaga aylantirish. Minimum 1 daqiqa. */
export function metersToWalkMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / WALK_SPEED_M_PER_MIN));
}

// --- O'zbekiston chegarasi (TZ FR-POST-06) --------------------------------

export const UZ_BOUNDS = {
  minLat: 37.0,
  maxLat: 45.7,
  minLng: 55.9,
  maxLng: 73.2,
} as const;

export function isInsideUzbekistan(lat: number, lng: number): boolean {
  return (
    lat >= UZ_BOUNDS.minLat &&
    lat <= UZ_BOUNDS.maxLat &&
    lng >= UZ_BOUNDS.minLng &&
    lng <= UZ_BOUNDS.maxLng
  );
}

/** Xarita boshlang'ich holati — butun mamlakat (TZ FR-MAP-01) */
export const UZ_MAP_CENTER = { lat: 41.5, lng: 64.0, zoom: 6 } as const;

// --- Katalog (TZ FR-CAT-05/06) --------------------------------------------

export const PAGE_SIZE = 24;
export const PAGE_SIZE_MAX = 100;
export const SEARCH_DEBOUNCE_MS = 400;

/**
 * "4+ xonali" filtri.
 *
 * Prototipda `p.rooms.toString() !== roomsVal` — ANIQ TENGLIK edi,
 * shuning uchun 5 va 6 xonali uylar "4+" filtrida hech qachon chiqmasdi.
 */
export const ROOMS_PLUS_THRESHOLD = 4;

export function matchesRoomsFilter(rooms: number, filter: number | 'any'): boolean {
  if (filter === 'any') return true;
  return filter >= ROOMS_PLUS_THRESHOLD ? rooms >= filter : rooms === filter;
}

// --- Media (TZ FR-POST-02/03/04) ------------------------------------------

export const MIN_IMAGES = 3;
export const MAX_IMAGES = 30;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** Panoramasiz e'lon chop etilmaydi — mahsulotning asosiy va'dasi */
export const MIN_PANORAMAS = 1;
export const MAX_PANORAMAS = 20;
export const MAX_PANORAMA_BYTES = 25 * 1024 * 1024;

export const PANORAMA_MIN_WIDTH = 4000;
export const PANORAMA_MIN_HEIGHT = 2000;
/** Equirectangular panorama nisbati */
export const PANORAMA_ASPECT_RATIO = 2;
export const PANORAMA_ASPECT_TOLERANCE = 0.05;

export const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;

export function isValidPanoramaSize(width: number, height: number): boolean {
  if (width < PANORAMA_MIN_WIDTH || height < PANORAMA_MIN_HEIGHT) return false;
  const ratio = width / height;
  return Math.abs(ratio - PANORAMA_ASPECT_RATIO) <= PANORAMA_ASPECT_TOLERANCE;
}

// --- Narx chegaralari (TZ FR-POST-08) -------------------------------------

export const PRICE_MIN_UZS = 1_000_000;
export const PRICE_MAX_UZS = 500_000_000_000;
export const AREA_MIN_M2 = 1;
export const AREA_MAX_M2 = 100_000;
export const ROOMS_MIN = 1;
export const ROOMS_MAX = 50;
export const FLOOR_MIN = 1;
export const FLOOR_MAX = 200;
export const BUILD_YEAR_MIN = 1850;

/**
 * Raqamni xavfsiz o'qish.
 *
 * Prototipda `parseInt` ishlatilardi va `parseInt("1e9") === 1` —
 * ya'ni 1 milliard so'mlik uy 1 so'mga aylanardi.
 * `Number()` eksponensial yozuvni to'g'ri o'qiydi.
 */
export function parseNumeric(input: unknown): number | null {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

// --- Telefon (TZ FR-AUTH-02) ----------------------------------------------

/** +998 XX XXX XX XX — bo'sh joylar va qavslar tozalangandan keyin */
export const UZ_PHONE_REGEX = /^\+998\d{9}$/;

export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, '');
  const withPrefix = digits.startsWith('+') ? digits : `+${digits}`;
  return UZ_PHONE_REGEX.test(withPrefix) ? withPrefix : null;
}

// --- OTP (TZ FR-AUTH-03/04) -----------------------------------------------

export const OTP_LENGTH = 6;
export const OTP_TTL_SECONDS = 5 * 60;
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_LOCKOUT_SECONDS = 15 * 60;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_PER_DAY = 10;

// --- AI qatlami (TZ §16) --------------------------------------------------

export const AI_MODELS = {
  /** Moderatsiya — birlamchi saralash */
  moderation: 'claude-haiku-4-5',
  /** Ishonch past bo'lganda eskalatsiya */
  moderationEscalation: 'claude-opus-5',
  /** Tavsif yaratish (uz + ru) */
  description: 'claude-sonnet-5',
} as const;

/** Bundan past ishonchda kuchliroq modelga o'tiladi (TZ FR-AI-08) */
export const AI_ESCALATION_THRESHOLD = 0.75;

// --- To'lov (v2.0, TZ QAROR-3) --------------------------------------------

/** Avans — uy narxining foizi, qotirilgan summa EMAS (TZ FR-PAY-02) */
export const DEPOSIT_PERCENT = 0.01;
export const DEPOSIT_MIN_UZS = 1_000_000;
export const DEPOSIT_MAX_UZS = 50_000_000;

export function calculateDeposit(price: number): number {
  const raw = price * DEPOSIT_PERCENT;
  return Math.min(DEPOSIT_MAX_UZS, Math.max(DEPOSIT_MIN_UZS, Math.round(raw)));
}
