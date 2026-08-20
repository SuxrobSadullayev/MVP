# `@3ds/db` — ma'lumotlar bazasi qatlami

Prisma sxemasi, migratsiyalar va ma'lumotnoma seed'i.

## Ishga tushirish

```bash
npm run db:up        # postgres + redis + minio
npm run db:migrate   # migratsiyalarni qo'llash
npm run db:seed      # 14 hudud + 192 tuman
npm run db:studio    # brauzerda ko'rish
```

`.env` monorepo **ildizida** turadi; `dotenv-cli` uni Prisma'ga uzatadi.

---

## ⚠️ TUZOQ: Prisma va xom SQL obyektlari

Bu sxemada Prisma o'zi yarata olmaydigan uchta narsa bor:

| Obyekt | Nima | Qayerda |
|---|---|---|
| `properties.geom`, `pois.geom` | `GENERATED ALWAYS` geography ustunlari | migratsiya SQL |
| GiST indekslari | geo so'rovlar uchun | migratsiya SQL |
| `CHECK` cheklovlari | narx, qavat, koordinata, radius | migratsiya SQL |

### Nima bo'lgan edi

Birinchi urinishda bu obyektlar **faqat** xom SQL da edi, sxemada e'lon qilinmagan.
Keyingi `prisma migrate diff` ularni "ortiqcha" deb hisobladi va migratsiyaga
quyidagini yozdi:

```sql
ALTER TABLE "properties" DROP COLUMN "geom";
ALTER TABLE "pois"       DROP COLUMN "geom";
DROP INDEX "properties_geom_idx";
DROP INDEX "pois_geom_idx";
-- + 8 ta trigram indeks
```

Ya'ni **butun geo qatlami o'chib ketardi.** Ustiga, generated ustunga
`ALTER COLUMN ... DROP DEFAULT` yozgan edi — bu PostgreSQL'da **xato beradi**:

```
ERROR: column "geom" of relation "pois" is a generated column
HINT:  Use ALTER TABLE ... ALTER COLUMN ... DROP EXPRESSION instead.
```

Ya'ni migratsiya deploy paytida yiqilardi.

### Yechim

Barcha obyektlar **sxemada e'lon qilingan**, shuning uchun Prisma ularni endi
taniydi va o'chirmoqchi bo'lmaydi:

```prisma
geom Unsupported("geography(Point, 4326)")? @default(dbgenerated())

@@index([geom], type: Gist)
@@index([title(ops: raw("gin_trgm_ops"))], type: Gin)
```

`Unsupported` maydonni Prisma Client o'qiy/yoza olmaydi — geo so'rovlar
`$queryRaw` orqali bajariladi. Bu ataylab: `geom` GENERATED bo'lgani uchun
unga yozish umuman mumkin emas.

### Qoida

> **Har bir yangi migratsiyani qo'llashdan OLDIN `migration.sql` ni o'qing.**
> `DROP COLUMN "geom"` yoki `DROP INDEX ... geom` ko'rsangiz — to'xtang.
> Bu sxemada nimadir e'lon qilinmay qolgan degani.

CI ga tekshiruv qo'shilishi kerak (TZ NFR-OPS-01):
`migration.sql` da `DROP COLUMN "geom"` bo'lsa — build yiqilsin.

---

## Nima uchun `CHECK` cheklovlari

Prototipdagi xatolar ilova darajasida emas, **baza darajasida** bloklanadi —
chunki ilovada bitta tekshiruvni unutish oson, bazada esa imkonsiz:

| Cheklov | Prototipda nima bo'lardi |
|---|---|
| `properties_price_positive` | `parseInt("1e9")` → `1`, manfiy narx qabul qilinardi |
| `properties_floor_valid` | qavat `5/12` qotirilgan edi, hech narsa tekshirmasdi |
| `properties_coords_in_uzbekistan` | joy belgilanmasa jimgina Toshkent markaziga tushardi |
| `property_pois_within_radius` | Samarqand uyiga Toshkent maktabi "yaqin" deb ko'rsatilardi (266 km) |
| `wallets_balance_non_negative` | balans manfiyga tushishi mumkin edi |

---

## Nima uchun `searchAliases`

Foydalanuvchi **viloyat emas, markaz shahar** nomini yozadi.

Seed dan keyin tekshirilganda 13 ta markazdan **7 tasi topilmadi**:
`Бухара`, `Фергана`, `Карши`, `Гулистан`, `Термез`, `Ургенч`, `Нукус` —
chunki bazada `Бухарская область` turadi, `Бухара` esa uning ichida yo'q.

`search_aliases` massivi shuni yopadi: markaz shahar nomi, inglizcha
transliteratsiya (`Bukhara`, `Samarkand`, `Kokand`) va muqobil yozuvlar.

Seed har safar bu 14 ta so'rovni tekshiradi va topilmasa **yiqiladi**.

---

## ⚠️ Tumanlar ro'yxati

192 ta tuman kiritilgan — ishonchli boshlang'ich to'plam, lekin **rasmiy
MHOBT (SOATO) klassifikatori bilan solishtirilmagan**. Tumanlar vaqti-vaqti
bilan birlashtiriladi, bo'linadi va qayta nomlanadi.

**Productionga chiqishdan oldin solishtirish shart.**
