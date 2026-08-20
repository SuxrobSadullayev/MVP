# 3DS Home Platform

360° virtual tur asosidagi ko'chmas mulk marketplace — butun O'zbekiston uchun.

**Farqlovchi g'oya:** har bir e'londa majburiy 360° tur + infratuzilma masofasi
**tizim tomonidan o'lchanadi**, sotuvchi uni o'zgartira olmaydi.

---

## Ishga tushirish

```bash
npm install
cp .env.example .env

npm run db:up        # postgres+postgis · redis · minio
npm run db:migrate   # 18 jadval + geo qatlami
npm run db:seed      # 14 hudud · 192 tuman

npm run check        # himoyalar + typecheck + testlar
```

Dizayn tizimini ko'rish: `xdg-open index.html`

---

## Struktura

```
apps/                     (1-bosqichda: api, web, worker)
packages/
  db/       Prisma sxemasi, migratsiyalar, hudud seed'i
  shared/   Zod sxemalari va biznes konstantalari — YAGONA manba
  ui/       dizayn tizimi: tokenlar, komponentlar, ekran maketlari
scripts/    CI himoyalari
docs/       TZ va dizayn tizimi hujjatlari
```

## Hujjatlar

| Hujjat | Mazmun |
|---|---|
| [docs/TZ.md](docs/TZ.md) | **Texnik topshiriq** — yagona haqiqat manbai |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Dizayn tizimi + o'lchov natijalari |
| [packages/db/README.md](packages/db/README.md) | ⚠️ Prisma + PostGIS tuzog'i — **o'qing** |

---

## Holat

| Bosqich | Holat |
|---|---|
| **Dizayn (Track 1)** | ✅ TZ §6 dan 27/29 · qolgan 2 tasi i18n, Next.js kutmoqda |
| **0. Poydevor** | ✅ Monorepo · Docker · DB · seed · shared · CI |
| **1. Backend yadro** | ⏳ keyingi — NestJS, auth, properties CRUD, POI engine |
| 2. Frontend yadro | — |
| 3. O'zaro aloqa | — |
| 4. Sayqal | — |
| 5. v2.0 to'lovlar | — |

### 1-bosqichni to'sadigan ochiq savollar

- **Hosting qayerda?** O'zbekiston qonunchiligi fuqarolar ma'lumotlarini
  mamlakat hududida saqlashni talab qiladi
- **SMS provayder?** (Eskiz / Play Mobile) — auth moduli uchun

> Kod tomondan ikkalasi ham abstraksiya orqali chetlab o'tilgan:
> SMS `SmsProvider` interfeysi ortida, deploy esa to'liq Docker asosida.
> Ya'ni 1-bosqichni boshlash uchun ular shart emas, lekin **relizgacha kerak**.

---

## CI himoyalari

Prototip buzuq holda commit qilingan va hech narsa buni aniqlamagan.
Shuning uchun CI da ikkita maxsus tekshiruv bor:

| Himoya | Nimani ushlaydi |
|---|---|
| `guard-migrations.mjs` | Migratsiya `geom` ustunini yoki geo-indeksni o'chirsa |
| `guard-asset-links.mjs` | HTML mavjud bo'lmagan lokal faylga havola qilsa |

Ikkalasi ham ataylab buzilgan kirish bilan sinovdan o'tgan.
