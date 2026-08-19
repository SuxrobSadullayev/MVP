# 🎨 DIZAYN TIZIMI — 3DS Home Platform

**Versiya:** 1.0 · **Sana:** 2026-08-20
**Kod:** [`packages/ui/src/tokens.css`](../packages/ui/src/tokens.css) · [`packages/ui/src/base.css`](../packages/ui/src/base.css)
**Jonli styleguide:** [`packages/ui/styleguide.html`](../packages/ui/styleguide.html)

> Bu hujjat TZ §6 (Track 1 — UX/UI) ni amalga oshiradi.
> TZ bilan solishtirish jadvali — §9.

---

## 1. Prinsiplar

Har bir vizual qaror shulardan biriga tayanadi. Tayanmasa — qaror emas, did.

| № | Prinsip | Amaliy ma'nosi |
|---|---|---|
| 1 | **Fotosurat birinchi** | UI chekinadi, mulk surati hukmronlik qiladi |
| 2 | **Ishonch ko'rinadigan bo'lsin** | Tizim hisoblagan va sotuvchi da'vo qilgan ma'lumot vizual jihatdan ajraladi |
| 3 | **Mobil — asosiy** | Malika (Namangan, faqat telefon) birlamchi persona |
| 4 | **Tez his qilinsin** | Skeleton, optimistik yangilanish, progressiv rasm |
| 5 | **Bir marta o'lchangan** | Har bir rang juftligi hisoblangan; komponentda xom qiymat yo'q |

---

## 2. Mavzu strategiyasi

**Light — sukut bo'yicha.** Sabab texnik emas, mahsulotga oid: fotosuratlar oq fonda haqiqatga yaqinroq ko'rinadi. Qora fon ularni sun'iy ravishda yorqinroq va to'yinganroq ko'rsatadi — ishonchga qurilgan mahsulot uchun bu noto'g'ri va'da.

**Dark — to'liq qo'llab-quvvatlanadi**, foydalanuvchi tanlovi yoki tizim sozlamasi bo'yicha.

**Immersiv sirtlar — har doim qorong'i.** 360° viewer va xarita `.surface-immersive` klassi bilan mavzudan qat'i nazar qorong'i qoladi: u yerda media o'zi kontent, chrome yo'qolishi kerak.

```
:root                          → light (sukut)
:root[data-theme="dark"]       → dark (aniq tanlov)
@media (prefers-color-scheme)  → tizim sozlamasiga ergashish
.surface-immersive             → har doim qorong'i
```

---

## 3. Rang

### 3.1 Uch qatlamli arxitektura

```
PRIMITIV   --p-slate-500     xom qiymat. Komponentda ISHLATILMAYDI.
SEMANTIK   --color-text-muted rolga bog'langan. Mavzu bilan almashadi.
KOMPONENT  --btn-*           faqat zarurat bo'lganda.
```

Komponent hech qachon primitivga murojaat qilmaydi. Shu qoida tufayli mavzu almashishi bitta joydan boshqariladi.

### 3.2 Nima uchun aynan shu ranglar

| Rol | Tanlov | Sabab |
|---|---|---|
| Neytral | Sovuq kulrang (slate) | Fotosuratlarga issiq rang berib yubormaydi |
| Brend | Siyan-ko'k | Prototipdagi "3D/texnologiya" xarakterini saqlaydi, lekin o'qiladigan darajada |
| VIP | Oltin | Premium signali, brenddan aniq ajraladi |
| Ishonch | Brend siyani | "Tizim hisobladi" ni brend bilan bog'laydi |

### 3.3 Metodologiya — nima uchun o'lchandi

Palitra dastlab **#FFFFFF ga nisbatan** tekshirilgan edi va o'shanda hammasi o'tgandek ko'rindi.

Keyin **render qilingan sahifada** o'lchov o'tkazildi va 4 ta yiqilish topildi. Sabab: sahifa foni oq emas — `slate-50 (#F8FAFC)`, badge fonlari esa 100-darajali tint. Ikkalasi ham koeffitsientni pasaytiradi.

> **Saboq:** kontrastni faqat oq fonga nisbatan tekshirish — xato metodologiya.
> Tekshiruv **eng yomon haqiqiy fonga** nisbatan bo'lishi kerak.

### 3.4 O'lchov natijalari

Barcha qiymatlar **render qilingan DOM** dan olingan (`getComputedStyle`), ikkala mavzuda, transitionlar o'chirilgan holda.

**Yakuniy holat: 46 ta tekshiruv, 0 ta yiqilish, eng past koeffitsient 5.06:1**

| Element | Light | Dark |
|---|---|---|
| Asosiy matn | 17.06 ✅ | 16.30 ✅ |
| Ikkilamchi matn | 7.58 ✅ | 12.02 ✅ |
| Xira matn | 5.75 ✅ | 6.96 ✅ |
| Primary tugma | 5.36 ✅ | 9.88 ✅ |
| Danger tugma | 6.01 ✅ | 7.50 ✅ |
| Badge VIP | 6.15 ✅ | 5.43 ✅ |
| Badge danger | 5.24 ✅ | 5.06 ✅ |
| Badge verified | 6.78 ✅ | 5.06 ✅ |
| `data-computed` | 6.99 ✅ | 9.24 ✅ |
| Interaktiv chegara | 3.57 ✅ | 3.75 ✅ |
| Focus halqasi | 3.68 ✅ | 9.88 ✅ |

**Ichki standart: barcha matn ≥ 5.0** (AA talabi 4.5 — zaxira qoldiriladi).

### 3.5 O'lchov natijasida RAD ETILGANLAR

| Qiymat | Muammo | O'rniga |
|---|---|---|
| `slate-400` xira matn | canvas'da 2.56 ❌ | `slate-550` (5.75) |
| `slate-500` xira matn | sunken fonda 4.34 ❌ | `slate-550` (5.49) |
| `brand-600` tugma foni | oq matn bilan 3.68 ❌ | `brand-700` (5.36) |
| `red-600` xato matni | canvas'da 4.49 ❌ | `red-700` (6.01) |
| `red-600` badge matni | tint fonda 3.91 ❌ | `red-700` (5.24) |
| `red-400` dark badge | `red-900` fonda 3.55 ❌ | `red-300` (5.06) |
| `gold-700` VIP badge | tint fonda 4.51 ⚠️ tor | `gold-800` (6.15) |
| `green-700` verified | tint fonda 4.84 ⚠️ tor | `green-800` (6.78) |
| `slate-500` dark xira | 3.75 ❌ | `slate-400` (6.96) |
| `#00F2FE` (prototip) | oq fonda o'qilmaydi | butunlay olib tashlandi |

### 3.6 Ataylab istisno

`--color-text-disabled` (light: 2.56:1) — **bu xato emas.** WCAG 1.4.3 o'chirilgan elementlarni kontrast talabidan istisno qiladi. Tokenda izoh qoldirilgan, "tuzatilmasin".

---

## 4. Tipografiya

**Yagona oila — Inter Variable.**

Prototipdagi **Outfit rad etildi**: u kirill alifbosini qo'llamaydi, rus tili esa MVP talabi (TZ QAROR-5). Bu — 3 oydan keyin bilinadigan xatolardan biri.

Bitta variable fayl = kam trafik, kichik o'lchamda eng yaxshi o'qiluvchanlik. Ierarxiya og'irlik, o'lcham va tracking bilan quriladi.

| Token | Px | Ishlatilishi |
|---|---|---|
| `--text-xs` | 12 | Faqat caption va meta |
| `--text-sm` | 14 | Ikkilamchi matn |
| `--text-base` | 16 | **Body — minimal ruxsat** |
| `--text-lg` | 18 | |
| `--text-xl` | 20 | Bo'lim sarlavhasi |
| `--text-2xl` | 24 | **Sarlavha — minimal** |
| `--text-4xl` / `5xl` | 36 / 48 | Hero |

Narxlarda `font-variant-numeric: tabular-nums` — raqamlar ustunda tekis turadi.

---

## 5. O'lcham tizimi

**Spacing** — 8px grid: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`
**Radius** — `6 (teg) · 10 (input/tugma) · 14 (kartochka) · 20 (modal)`
**Tegish maydoni** — `--tap-min: 44px`, barcha interaktiv elementda
**Motion** — `120ms (hover) · 200ms (ochilish) · 320ms (modal)`
**Z-index** — markazlashgan shkala: `sticky 100 → header 200 → dropdown 300 → overlay 400 → modal 500 → toast 600`. `z-index: 9999` urushlari yo'q.

---

## 6. Komponent holatlari

Har bir komponent uchun **barcha holat** majburiy (TZ NFR-UX-05).

| Komponent | Holatlar |
|---|---|
| Tugma | default · hover · active · disabled · loading |
| Input | default · hover · focus · filled · error · disabled |
| Kartochka | default · hover · skeleton |
| Ro'yxat | to'la · skeleton · bo'sh (empty state) |

**Focus:** `:focus-visible` ishlatiladi — sichqoncha bilan bosganda halqa chiqmaydi, klaviatura bilan kelganda majburiy chiqadi. `outline: none` **taqiqlanadi**.

---

## 7. Ishonch tili — mahsulotga xos qism

Bu bo'lim dizayn tizimini **shu mahsulotga xos** qiladi. Foydalanuvchi bir qarashda ajratishi kerak:

| Klass | Ma'nosi | Ko'rinishi |
|---|---|---|
| `.data-computed` | Tizim hisobladi — POI masofasi, koordinata | Brend rangli, tabular raqam |
| `.data-claimed` | Sotuvchi kiritdi — tavsif, sarlavha | Neytral |

Bu TZ **FR-MAP-09** ("POI faqat tizim tomonidan hisoblanadi, sotuvchi tahrirlay olmaydi") ning vizual ifodasi. Qoida backendda majburlanadi, dizaynda **ko'rinadigan** qilinadi.

---

## 8. Nazorat ro'yxati

Har bir yangi komponent shundan o'tadi:

- [ ] Barcha holat bormi: default, hover, focus, active, disabled, loading, error, empty
- [ ] Kontrast **o'lchanganmi** (taxmin emas)? Matn ≥ 5.0, interaktiv chegara ≥ 3.0
- [ ] Kontrast **eng yomon haqiqiy fonga** nisbatan tekshirildimi (oq emas)?
- [ ] Tegish maydoni ≥ 44×44 px
- [ ] Klaviatura bilan yetib boriladimi? Focus halqasi ko'rinadimi?
- [ ] Faqat ikonkali tugmada `aria-label` bormi?
- [ ] Faqat rangga tayanmaydimi (rang + belgi/matn)?
- [ ] Uzun matn / uzun nom komponentni buzmaydimi?
- [ ] **Light va dark — ikkalasida ham** tekshirildimi?
- [ ] Xom qiymat (hex, px) yozilmaganmi — faqat token?

---

## 9. TZ BILAN SOLISHTIRISH

### 9.1 §6.1 Dizayn tizimi

| TZ ID | Talab | Holat |
|---|---|---|
| NFR-UX-01 | Dizayn tizimi kod bazasida | ✅ `packages/ui` |
| NFR-UX-02 | Rang/shrift/spacing/radius/shadow — token | ✅ |
| NFR-UX-03 | 8px grid | ✅ |
| NFR-UX-04 | Maksimum 2 shrift oilasi | ✅ 1 ta (qat'iyroq) |
| NFR-UX-05 | Barcha komponent holatlari | ⚠️ Tugma/input/kartochka ✅ · qolgan komponentlar hali yo'q |
| NFR-UX-06 | Light va dark | ✅ |

### 9.2 §6.2 Mobil

| TZ ID | Talab | Holat |
|---|---|---|
| NFR-UX-07 | Mobile-first | ✅ Grid `auto-fill`, media query'siz moslashadi |
| NFR-UX-08 | ≥ 44×44 px | ✅ `--tap-min` |
| NFR-UX-09 | CTA thumb-zone da | ❌ Ekran maketi darajasi — keyingi bosqich |
| NFR-UX-10 | Input turlari (`tel`, `email`) | ❌ Ekran darajasi |
| NFR-UX-11 | Bottom navigation | ❌ Ekran darajasi |

### 9.3 §6.3 Feedback

| TZ ID | Talab | Holat |
|---|---|---|
| NFR-UX-12 | Toast navbat bilan | ❌ JS komponent — hali yo'q |
| NFR-UX-13 | Faol navigatsiya holati | ❌ Ekran darajasi |
| NFR-UX-14 | Loading holati | ⚠️ Skeleton + tugma loading ✅ · qolgani yo'q |
| NFR-UX-15 | Empty state | ✅ |
| NFR-UX-16 | 404 / 500 sahifalari | ❌ Hali yo'q |

### 9.4 §6.4 Accessibility

| TZ ID | Talab | Holat |
|---|---|---|
| NFR-A11Y-01 | Kontrast ≥ 4.5:1 | ✅ **O'lchandi** — 46/46, eng past 5.06 |
| NFR-A11Y-02 | Tab + focus indikatori | ✅ `:focus-visible` |
| NFR-A11Y-03 | Modal Esc + focus trap | ❌ JS komponent — hali yo'q |
| NFR-A11Y-04 | `alt`, `aria-label` | ⚠️ Konvensiya belgilandi, majburlanmagan |
| NFR-A11Y-05 | Xato `role="alert"` | ✅ |
| NFR-A11Y-06 | `prefers-reduced-motion` | ✅ |

### 9.5 §6.5 Kontent va til

| TZ ID | Talab | Holat |
|---|---|---|
| NFR-I18N-01/02 | uz + ru, tarjima fayllari | ❌ Hali yo'q |
| NFR-CNT-01/02/03 | CTA, xato, placeholder sifati | ⚠️ Prinsip ko'rsatildi, amalga oshirilmagan |

### 9.6 Xulosa

```
✅ To'liq bajarildi:      12 ta talab
⚠️ Qisman:                 4 ta talab
❌ Hali boshlanmagan:      9 ta talab  (ekran maketi va JS komponentlar darajasi)
```

**Bajarilgani — poydevor** (§6.1 to'liq, §6.4 asosiy qismi).
**Bajarilmagani — ekran va komponent darajasi**, u keyingi qadam.

---

## 10. TZ GA QO'SHILISHI KERAK BO'LGAN YANGI TALABLAR

Dizayn jarayonida TZ da yo'q, lekin zarur ekani aniqlangan talablar:

| Yangi ID | Talab | Sabab |
|---|---|---|
| **NFR-UX-17** | Kontrast **render qilingan sahifada**, eng yomon fonga nisbatan tekshiriladi. CI da avtomatlashtiriladi | Faqat #FFFFFF ga tekshirish 4 ta yiqilishni yashirgan edi |
| **NFR-UX-18** | Har qanday shrift **kirill alifbosini qo'llashi shart** | Outfit shu sababdan rad etildi; ru — MVP talabi |
| **NFR-UX-19** | Immersiv sirtlar (360° viewer, xarita) mavzudan qat'i nazar qorong'i | Media o'zi kontent |
| **NFR-UX-20** | "Tizim hisobladi" va "sotuvchi kiritdi" ma'lumoti vizual jihatdan ajraladi | FR-MAP-09 ning ko'rinadigan ifodasi |
| **NFR-UX-21** | Ichki standart: matn kontrasti ≥ **5.0** (AA 4.5 + zaxira) | 4.51 da turgan tizim birinchi o'zgarishda yiqiladi |
