# 📋 TEXNIK TOPSHIRIQ — 3DS HOME PLATFORM

**Loyiha:** 3DS Home Platform — 360° Virtual Tur asosidagi ko'chmas mulk marketplace
**Hudud:** Butun O'zbekiston Respublikasi (14 ta ma'muriy hudud)
**Hujjat versiyasi:** 1.2
**Sana:** 2026-08-20
**Buyurtmachi:** Suxrob Sadullayev
**Holat:** Arxitektura qarorlari qabul qilindi (§15)

---

## 0. HUJJAT HAQIDA

Bu hujjat loyihaning **yagona haqiqat manbai** (single source of truth). Kod, dizayn, testlar — barchasi shu yerdagi talablarga bo'ysunadi.

### 0.1 Talab identifikatorlari

Har bir talabning noyob ID si bor. QA test-case'lari shu ID ga bog'lanadi.

| Prefiks | Ma'nosi |
|---|---|
| `FR-*` | Funksional talab (Functional Requirement) |
| `NFR-*` | Nofunksional talab (Non-Functional Requirement) |
| `DM-*` | Ma'lumot modeli talabi (Data Model) |
| `SEC-*` | Xavfsizlik talabi |
| `AC-*` | Qabul mezoni (Acceptance Criteria) |

### 0.2 Prioritet belgilari

| Belgi | Ma'nosi |
|---|---|
| 🔴 **P0** | MVP relizisiz mumkin emas. Bloker. |
| 🟠 **P1** | MVP ga kiradi, lekin relizni to'xtatmaydi |
| 🟡 **P2** | MVP dan keyingi birinchi iteratsiya |
| ⚪ **P3** | Backlog / kelajak |

### 0.3 Manba

Ushbu TZ **v5.0 prototipi auditidan** kelib chiqadi. Prototipda aniqlangan 50 ta kamchilikning har biri quyida talabga aylantirilgan va `[← BUG-xx]` belgisi bilan izohlanган. Prototip kodi `git` tarixida saqlangan (commit `787d933`), lekin **noldan qayta yoziladi**.

---

## 1. MAHSULOT

### 1.1 Muammo

O'zbekiston ko'chmas mulk bozorida ikki asosiy muammo bor:

1. **Ishonchsizlik.** E'lonlardagi rasmlar ko'pincha haqiqatga mos kelmaydi yoki eskirgan. Xaridor uyni ko'rish uchun shahar bo'ylab yuradi, vaqtini yo'qotadi.
2. **Joylashuv qiymatining noaniqligi.** "Maktabga yaqin", "markazda" — o'lchab bo'lmaydigan, sotuvchi tomonidan aytilgan da'volar.

### 1.2 Yechim

| Muammo | Yechim |
|---|---|
| Ishonchsizlik | Har bir e'lon uchun **majburiy 360° virtual tur** — uyni brauzerda aylanib ko'rish |
| Joylashuv noaniqligi | **Avtomatik infratuzilma masofasi** — tizim OpenStreetMap ma'lumotlari asosida o'zi hisoblaydi, sotuvchi kirisha olmaydi |

### 1.3 Biznes maqsadi (MVP bosqichi)

- 14 ta hududning kamida 5 tasida faol e'lonlar
- 500+ tasdiqlangan e'lon
- 1000+ ro'yxatdan o'tgan foydalanuvchi
- Avans/bron tranzaksiyalari orqali komissiya modeli isbotlansin

### 1.4 MVP ga KIRMAYDI (aniq chegara)

Quyidagilar MVP doirasidan **ataylab chiqarilgan**:

- ❌ **To'lov moduli va eskrou** (Payme/Click, avans, hamyon) — **v2.0 ga ko'chirildi**, sabab: §15 QAROR-3
- ❌ Ipoteka kalkulyatori va bank integratsiyasi
- ❌ Sotuvchilar uchun mobil ilova (faqat responsive web)
- ❌ AI narx bahosi / tavsiya tizimi
- ❌ Video-qo'ng'iroq
- ❌ Ijara shartnomasini elektron imzolash
- ❌ VR-shlem (WebXR) rejimi
- ❌ Ko'chmas mulk agentliklari uchun CRM

**MVP ga KIRADI (§15 qarorlari bo'yicha):**

- ✅ Sotuv **va ijara** (`deal_type`)
- ✅ **uz + ru** tillari
- ✅ Moderatsiya paneli
- ✅ **Majburiy 360° panorama** (e'lon busiz chop etilmaydi)

---

## 2. FOYDALANUVCHILAR VA ROLLAR

### 2.1 Rol matritsasi

| Imkoniyat | Mehmon | Buyer | Seller | Moderator | Admin |
|---|:--:|:--:|:--:|:--:|:--:|
| Katalogni ko'rish | ✅ | ✅ | ✅ | ✅ | ✅ |
| 360° tur ko'rish | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xaritani ko'rish | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sevimlilarga qo'shish | ❌ | ✅ | ✅ | ✅ | ✅ |
| Chat yozish | ❌ | ✅ | ✅ | ❌ | ❌ |
| Avans to'lash | ❌ | ✅ | ❌ | ❌ | ❌ |
| E'lon joylash | ❌ | ❌ | ✅ | ❌ | ✅ |
| O'z e'lonini tahrirlash | ❌ | ❌ | ✅ | ❌ | ✅ |
| E'lon moderatsiyasi | ❌ | ❌ | ❌ | ✅ | ✅ |
| Foydalanuvchi bloklash | ❌ | ❌ | ❌ | ❌ | ✅ |
| Moliyaviy hisobotlar | ❌ | ❌ | ❌ | ❌ | ✅ |

> 🔴 **SEC-01 [← BUG-03]** — Rol **faqat serverda** aniqlanadi va JWT ichida saqlanadi. Prototipda rol bir tugma bosish bilan almashardi (`buyer → seller → admin`). Frontend roli faqat UI ko'rinishini boshqaradi, **hech qanday holatda avtorizatsiya qarori qabul qilmaydi**.

### 2.2 Personalar

| Persona | Tavsif | Asosiy ehtiyoj |
|---|---|---|
| 👶 **Dilnoza, 28** — birinchi uyini qidirmoqda | Onlayn xaridga o'rganmagan, telefonda | Sodda oqim, ishonch belgilari |
| 😤 **Jasur, 35** — shoshib turgan xaridor | Bir necha platformada qidiryapti | Tez filtr, tez natija |
| 👴 **Rustam aka, 56** — ikkilamchi bozor | Katta shrift kerak, sichqoncha bilan | Katta tugmalar, aniq matn |
| 📱 **Malika, 22** — faqat telefonda, Namangan | 3G/4G, trafik cheklangan | Yengil sahifa, offline xabar |
| 🏢 **Sardor, 41** — professional sotuvchi | Kuniga 5-10 e'lon joylaydi | Tez forma, ommaviy amallar |

---

## 3. HUDUDIY MIQYOS

> 🔴 **DM-01 [← BUG-02]** — Prototipda faqat `address` matn maydoni bor edi, hududiy filtr imkonsiz edi. Bu **strukturaviy bloker**.

### 3.1 Ma'muriy bo'linish (majburiy ma'lumotnoma)

Tizimda **14 ta hudud** to'liq kiritilgan bo'lishi shart:

```
1.  Toshkent shahri          8.  Namangan viloyati
2.  Toshkent viloyati        9.  Samarqand viloyati
3.  Andijon viloyati        10.  Surxondaryo viloyati
4.  Buxoro viloyati         11.  Sirdaryo viloyati
5.  Farg'ona viloyati       12.  Xorazm viloyati
6.  Jizzax viloyati         13.  Qashqadaryo viloyati
7.  Navoiy viloyati         14.  Qoraqalpog'iston Respublikasi
```

- 🔴 **DM-02** — Har bir hudud uchun **tumanlar/shaharlar ro'yxati** ma'lumotnoma jadvalida (seed data).
- 🔴 **DM-03** — Nomlar **uz-Latn, uz-Cyrl va ru** variantlarida saqlanadi (qidiruv uchun).
- 🔴 **FR-CAT-01** — Katalogda **hudud → tuman** kaskadli filtri.
- 🟠 **FR-CAT-02** — Foydalanuvchi hududi brauzer geolokatsiyasi orqali taklif qilinadi (majburlanmaydi).

### 3.2 Xarita boshlang'ich holati

> 🔴 **FR-MAP-01 [← BUG-53]** — Xarita boshlang'ich markazi butun mamlakatni qamrasin: `lat 41.5, lng 64.0, zoom 6`. Prototipda Toshkent markazi va `zoom 13` qotirilgan edi.

### 3.3 POI (infratuzilma) manbai

> 🔴 **FR-MAP-02 [← BUG-02, BUG-50]** — Prototipda **13 ta qotirilgan Toshkent nuqtasi** bor edi. Samarqanddagi uy uchun "maktabgacha 268 km, 3350 daqiqa piyoda" degan natija chiqardi.

**Yangi talab:**

- 🔴 **FR-MAP-03** — POI manbai — **OpenStreetMap Overpass API**. Backend so'rov yuboradi, natijani o'z bazasiga keshlaydi.
- 🔴 **FR-MAP-04** — POI turlari: `maktab`, `bog'cha`, `universitet`, `shifoxona`, `dorixona`, `supermarket`, `bozor`, `bank`, `metro`, `avtobus bekati`, `park`, `zapravka`.
- 🔴 **FR-MAP-05 [← BUG-51]** — **Radius cheklovi: 2000 metr.** Undan uzoq obyekt "yaqin-atrofdagi infratuzilma" sifatida ko'rsatilmaydi.
- 🔴 **FR-MAP-06** — Har bir turdan **eng yaqin 3 tasi**, jami maksimum **12 ta** POI ko'rsatiladi.
- 🟠 **FR-MAP-07 [← BUG-52]** — Masofa Haversine (to'g'ri chiziq) bilan hisoblanadi va UI da **"~"** belgisi bilan, "taxminan" izohi bilan ko'rsatiladi. Piyoda yurish tezligi: 80 m/daq.
- 🟡 **FR-MAP-08** — Keyingi iteratsiyada real piyoda marshrut (OSRM/Valhalla) ga o'tiladi.
- 🔴 **FR-MAP-09 [← BUG-38]** — POI ma'lumotlari **faqat tizim tomonidan hisoblanadi**. Sotuvchi ularni kiritish yoki tahrirlash imkoniga **ega emas**. Prototipda `nearbyPoi` qo'lda yozilgan edi va engine hisobi bilan mos kelmasdi.

---

## 4. FUNKSIONAL TALABLAR

### 4.1 Autentifikatsiya (`FR-AUTH-*`)

> [← BUG-02 (login oqimi umuman yo'q edi), BUG-40]

| ID | Prio | Talab |
|---|:--:|---|
| **FR-AUTH-01** | 🔴 | Ro'yxatdan o'tish/kirish — **telefon raqam + SMS OTP** (O'zbekiston standarti) |
| **FR-AUTH-02** | 🔴 | Telefon formati `+998 XX XXX XX XX`, server tomonida validatsiya |
| **FR-AUTH-03** | 🔴 | OTP 6 xonali, amal muddati **5 daqiqa**, 3 marta xato → 15 daqiqa bloklash |
| **FR-AUTH-04** | 🔴 | OTP yuborishga **rate limit**: bitta raqamga 1 daqiqada 1 marta, kuniga 10 marta |
| **FR-AUTH-05** | 🔴 | Sessiya — **JWT access (15 daq) + refresh (30 kun)**, refresh `httpOnly` cookie da |
| **FR-AUTH-06** | 🔴 | Mehmon rejimi: katalog, tur, xarita — ro'yxatsiz ochiq. Sevimli/chat/to'lov — kirish talab qilinadi |
| **FR-AUTH-07** | 🟠 | Sotuvchi bo'lish — profil orqali ariza, moderator tasdiqlaydi |
| **FR-AUTH-08** | 🟠 | Chiqish (logout) — refresh token serverda bekor qilinadi |

### 4.2 Katalog (`FR-CAT-*`)

| ID | Prio | Talab |
|---|:--:|---|
| **FR-CAT-03** | 🔴 | Filtrlar: hudud, tuman, mulk turi, **bitim turi (sotuv/ijara)**, narx oralig'i, xonalar, maydon oralig'i, qavat |
| **FR-CAT-04** | 🔴 | **[← BUG-B8]** "4+ xonali" filtri `rooms >= 4` mantiqida ishlasin. Prototipda `rooms === 4` aniq tenglik edi — 5 va 6 xonalilar topilmasdi |
| **FR-CAT-05** | 🔴 | **[← BUG-E27]** **Sahifalash (pagination)**: sahifada 24 ta e'lon. Prototipda barcha e'lon bir vaqtda chizilardi |
| **FR-CAT-06** | 🔴 | **[← BUG-E28]** Qidiruv **debounce 400ms**. Prototipda har bosilgan harfda butun katalog qayta chizilardi |
| **FR-CAT-07** | 🔴 | **[← BUG-40]** Saralash: **eng yangi** (default), arzon→qimmat, qimmat→arzon, maydon bo'yicha. Buning uchun `created_at` maydoni shart |
| **FR-CAT-08** | 🔴 | **[← BUG-03]** Qidiruv **matn normalizatsiyasi**: `'` `'` `ʻ` apostroflari, uz-Latn ↔ uz-Cyrl ↔ ru transliteratsiyasi. "Buxoro" = "Бухара" = "Bukhara" |
| **FR-CAT-09** | 🔴 | **[← BUG-F32]** Filtr holati **URL query parametrlarida** saqlanadi (`?region=samarqand&rooms=3`). Sahifa yangilansa, ulashilsa — filtr saqlanadi |
| **FR-CAT-10** | 🔴 | **[← BUG-E30]** Sevimlilarga qo'shish **faqat o'sha tugmani** yangilaydi, butun katalogni qayta chizmaydi. Scroll pozitsiyasi saqlanadi |
| **FR-CAT-11** | 🔴 | **[← BUG-C17]** "360° TUR" belgisi **faqat panorama mavjud bo'lganda** ko'rsatiladi. Prototipda shartsiz chizilardi |
| **FR-CAT-12** | 🟠 | Bo'sh natija holati: rasm + sarlavha + "filtrni kengaytiring" CTA |
| **FR-CAT-13** | 🟠 | Skeleton loader — yuklanish paytida |

### 4.3 360° Virtual Tur (`FR-TOUR-*`)

| ID | Prio | Talab |
|---|:--:|---|
| **FR-TOUR-01** | 🔴 | Three.js (**joriy LTS versiya**, r128 emas) — ichkariga ag'darilgan sfera + equirectangular panorama |
| **FR-TOUR-02** | 🔴 | Boshqaruv: drag bilan aylantirish, avto-aylanish, xonalar orasida almashish |
| **FR-TOUR-03** | 🔴 | **[← BUG-C20]** Mobilda **pinch-to-zoom**. Prototipda faqat `wheel` bor edi — telefonda zoom imkonsiz |
| **FR-TOUR-04** | 🔴 | **[← BUG-C16]** Panorama yuklanayotganda **progress indikatori** (foizli). 2000px rasm 3G da 10+ soniya yuklanadi |
| **FR-TOUR-05** | 🔴 | **[← BUG-C16]** `onError` ishlovchisi: rasm yuklanmasa — "Panorama yuklanmadi, qayta urinish" tugmasi. Prototipda abadiy qora ekran edi |
| **FR-TOUR-06** | 🔴 | **[← BUG-C19]** Modal yopilganda **to'liq tozalash**: `geometry.dispose()`, `texture.dispose()`, `renderer.dispose()`, barcha `removeEventListener`. Prototipda 10 ta uy ko'rilgach WebGL konteksti limiti (16) tugab, tur butunlay ishlamay qolardi |
| **FR-TOUR-07** | 🔴 | **[← BUG-C19]** Event listener'lar **`window` ga emas, canvas elementiga** biriktiriladi |
| **FR-TOUR-08** | 🔴 | **[← BUG-B12]** Yangi uy ochilganda kamera burchagi **`lon=0, lat=0` ga qaytariladi** |
| **FR-TOUR-09** | 🔴 | **[← BUG-C17]** `panoramas` bo'sh bo'lsa — viewer o'rniga "Bu e'londa 360° tur mavjud emas" holati. Prototipda `TypeError` bilan qulardi |
| **FR-TOUR-10** | 🔴 | **[← BUG-C18]** Canvas o'lchami **`ResizeObserver`** orqali aniqlanadi, `setTimeout(100)` poyga holati emas |
| **FR-TOUR-11** | 🟠 | **[← BUG-B11]** Avto-aylanish tugmasi **holatini ikonka bilan ko'rsatadi** (play/pause) |
| **FR-TOUR-12** | 🟠 | Fullscreen rejimi + Esc bilan chiqish |
| **FR-TOUR-13** | 🟠 | Panorama **progressive yuklash**: avval past sifat (blur), keyin to'liq |
| **FR-TOUR-14** | 🟡 | Xonalar orasida hotspot (panorama ichidagi bosiladigan nuqtalar) |

### 4.4 Xarita (`FR-MAP-*`)

| ID | Prio | Talab |
|---|:--:|---|
| **FR-MAP-10** | 🔴 | **[← BUG-№1]** `clearMarkers()` — markerlarni tozalash funksiyasi **yozilgan bo'lishi shart**. Prototipda chaqirilar, lekin ta'riflanmagan edi → `TypeError` → xaritada birorta uy ko'rinmasdi |
| **FR-MAP-11** | 🔴 | **[← BUG-B10]** Xarita instansiyalari **izolyatsiyalangan**. Prototipda `MapEngine.map` singleton edi: xarita sahifasidan "E'lon berish" ochilsa — orqadagi xarita o'lardi |
| **FR-MAP-12** | 🔴 | **[← BUG-E29]** **Marker klasterlash** (`leaflet.markercluster`). 5000 e'lon = 5000 DOM element = brauzer qotadi |
| **FR-MAP-13** | 🔴 | **[← BUG-E31]** E'lonlar **viewport chegarasi bo'yicha** yuklanadi (`bbox` so'rovi), hammasi birdan emas |
| **FR-MAP-14** | 🟠 | Marker — narx yozilgan badge, VIP alohida rang |
| **FR-MAP-15** | 🟠 | Xarita ↔ ro'yxat sinxronlashuvi (marker hover → ro'yxatda yoritish) |
| **FR-MAP-16** | 🟠 | Tile provayderi litsenziyasi tekshirilgan va hujjatlashtirilgan bo'lsin (CartoDB bepul limitlari tijorat foydalanish uchun yetarli emas) |

### 4.5 E'lon joylash (`FR-POST-*`)

> Bu — eng ko'p ma'lumot buzilishi aniqlangan modul.

| ID | Prio | Talab |
|---|:--:|---|
| **FR-POST-01** | 🔴 | **[← BUG-23]** E'lon joylash **faqat `seller` roli** uchun. Prototipda buyer ham joylay olardi, tugma hammaga ko'rinardi |
| **FR-POST-02** | 🔴 | **[← BUG-A4]** **Rasm yuklash majburiy**: minimum 3 ta foto. Prototipda `coverImage` Unsplash'dan qotirilgan edi — barcha yangi e'lon bir xil ko'rinardi |
| **FR-POST-03** | 🔴 | **[← BUG-A4]** **Panorama yuklash majburiy**: minimum 1 ta 360° rasm. Prototipda begona yotoqxona panoramasi qotirilgan edi — bu loyihaning asosiy va'dasini yo'q qilardi |
| **FR-POST-04** | 🔴 | Yuklash cheklovlari: rasm ≤ 10 MB, panorama ≤ 25 MB, format `jpg/png/webp`, MIME server tomonida tekshiriladi |
| **FR-POST-05** | 🔴 | **[← BUG-A3]** Formada **qavat va umumiy qavatlar** maydonlari bo'lsin. Prototipda `floor: 5, totalFloors: 12` qotirilgan edi — **har bir yangi e'lon yolg'on qavat ko'rsatardi** |
| **FR-POST-06** | 🔴 | **[← BUG-A2]** **Xaritada joy belgilash majburiy.** Belgilanmasa — forma yuborilmaydi. Prototipda Toshkent markaziga default tushardi: Namangandagi uy Toshkentda paydo bo'lardi |
| **FR-POST-07** | 🔴 | **[← BUG-A1]** Forma holati **komponent state ida**, `window` global o'zgaruvchilarida emas. Prototipda `window.pickedLat` tozalanmasdi → keyingi e'lon **oldingi uyning koordinatasini** jimgina olardi |
| **FR-POST-08** | 🔴 | **[← BUG-A6]** Raqamli maydonlar `Number()` bilan, `parseInt` bilan emas. `parseInt("1e9") === 1` — narx buziladi. `min`, `max`, manfiy son taqiqlanadi |
| **FR-POST-09** | 🔴 | **[← BUG-A5]** `verified` va `rating` **sotuvchi tomonidan o'rnatilmaydi**. Prototipda har bir yangi sotuvchi darhol "tasdiqlangan, 5.0 reyting" olardi |
| **FR-POST-10** | 🔴 | **[← BUG-A7]** USD narxi **kunlik CBU (Markaziy Bank) kursi** bo'yicha hisoblanadi. Prototipda `/12600` qotirilgan edi |
| **FR-POST-11** | 🔴 | Barcha maydonlar server tomonida qayta validatsiya qilinadi (client validatsiyasiga ishonilmaydi) |
| **FR-POST-12** | 🟠 | Qoralama (draft) sifatida saqlash |
| **FR-POST-13** | 🟠 | O'z e'lonini tahrirlash → qayta moderatsiyaga tushadi |
| **FR-POST-14** | 🟠 | E'lonni arxivlash / "sotildi" deb belgilash |

### 4.6 Chat (`FR-CHAT-*`)

| ID | Prio | Talab |
|---|:--:|---|
| **FR-CHAT-01** | 🔴 | **[← BUG-F37]** Chat **ikki tomonlama**. Prototipda `sender: 'buyer'` qotirilgan edi — sotuvchi rolida ham xaridor sifatida yozilardi |
| **FR-CHAT-02** | 🔴 | **[← BUG-B9]** Yangi xabar kelganda lenta **pastga scroll qilinadi**. Prototipda butun modal qayta chizilardi va lenta yuqoriga qaytardi |
| **FR-CHAT-03** | 🔴 | Yangi xabar — **faqat qo'shiladi**, butun ro'yxat qayta chizilmaydi |
| **FR-CHAT-04** | 🔴 | **[← BUG-F36]** Sotuvchi **o'zi bilan chat ocholmaydi** (server tekshiruvi) |
| **FR-CHAT-05** | 🔴 | **[← BUG-B14]** Badge **o'qilmagan xabarlar sonini** ko'rsatadi, umumiy chat sonini emas |
| **FR-CHAT-06** | 🔴 | Real-time yetkazish — **WebSocket**. Fallback: polling |
| **FR-CHAT-07** | 🔴 | **[← BUG-16]** Barcha ID lar **UUID**. Prototipda `'chat_' + (length + 1)` — kolliziyaga olib keladigan naqsh |
| **FR-CHAT-08** | 🟠 | Xabar holatlari: yuborildi / yetkazildi / o'qildi |
| **FR-CHAT-09** | 🟠 | Rasm/fayl biriktirish (prototipda tugma bor edi, funksiya yo'q edi) |
| **FR-CHAT-10** | 🟠 | Shikoyat qilish / bloklash |
| **FR-CHAT-11** | 🟡 | Ovozli xabar |

### 4.7 Hamyon va to'lovlar (`FR-PAY-*`)

> ⛔ **BU MODUL MVP GA KIRMAYDI — v2.0 ga ko'chirildi (§15 QAROR-3).**
>
> Sabab: eskrou — O'zbekiston qonunchiligida litsenziya talab qilishi mumkin bo'lgan faoliyat, bu masala hal qilinmagan. MVP gipotezasi "360° tur + avtomatik POI **murojaat** keltiradimi?" — "pul ushlab tura olamizmi?" emas.
>
> **Lekin ma'lumot modeli hozirdan tayyorlanadi** (§5.1 dagi `wallets`, `transactions`, `deposits` jadvallari) — v2.0 da migratsiya og'rig'isiz qo'shilsin. Quyidagi talablar **v2.0 uchun kuchda qoladi**.

| ID | Prio | Talab |
|---|:--:|---|
| **FR-PAY-01** | 🔴 | **[← BUG-39]** To'lov gateway — **Payme va Click** (O'zbekiston bozorining asosiy tizimlari). Prototipda faqat logotiplar bor edi |
| **FR-PAY-02** | 🔴 | **[← BUG-D21]** Avans summasi — **uy narxining foizi** (default 1%, min/max chegaralari bilan). Prototipda 780 mln va 2.8 mlrd uchun bir xil 10 mln edi |
| **FR-PAY-03** | 🔴 | **[← BUG-D22]** To'lovdan oldin **tasdiqlash oynasi**: summa, uy, sotuvchi, shartlar. Prototipda bir bosishda 10 mln ketardi |
| **FR-PAY-04** | 🔴 | **[← BUG-D22]** **Idempotentlik kaliti** — ikki marta bosish ikki marta yechmasin |
| **FR-PAY-05** | 🔴 | **[← BUG-D23]** **Eskrou modeli**: pul platformada bloklanadi, bitim yakunlangach sotuvchiga o'tadi. Prototipda pul shunchaki yo'q bo'lardi — sotuvchi hech narsa olmasdi |
| **FR-PAY-06** | 🔴 | **[← BUG-D23]** **Qaytarish (refund) oqimi** — bitim bekor qilinsa |
| **FR-PAY-07** | 🔴 | **[← BUG-D24]** **Tranzaksiyalar tarixi** — har bir amal: sana, summa, tur, holat, kontragent, kvitansiya |
| **FR-PAY-08** | 🔴 | Balans **serverda** hisoblanadi. Frontend faqat ko'rsatadi |
| **FR-PAY-09** | 🔴 | Barcha moliyaviy amallar **audit log** ga yoziladi (o'zgartirilmaydigan) |
| **FR-PAY-10** | 🔴 | **[← BUG-20]** Karta biriktirish — **gateway tokenizatsiyasi** orqali. Karta raqami platforma bazasida **hech qachon saqlanmaydi**. Prototipda tasodifiy raqam generatsiya qilinardi |
| **FR-PAY-11** | 🟠 | **[← BUG-19]** Balansni to'ldirish — **summa kiritish maydoni** bilan. Prototipda 50 mln havodan paydo bo'lardi |
| **FR-PAY-12** | 🟠 | Yechib olish (withdrawal) — sotuvchilar uchun |

### 4.8 Sevimlilar (`FR-FAV-*`)

| ID | Prio | Talab |
|---|:--:|---|
| **FR-FAV-01** | 🔴 | **[← BUG-02]** **Sevimlilar sahifasi** yozilgan bo'lsin. Prototipda tugma bor edi, `openFavorites()` funksiyasi **umuman mavjud emas** edi → bosilsa `TypeError` |
| **FR-FAV-02** | 🔴 | Serverda saqlanadi, qurilmalar orasida sinxron |
| **FR-FAV-03** | 🟠 | Narx o'zgarsa bildirishnoma |

### 4.9 Moderatsiya va admin (`FR-ADM-*`)

| ID | Prio | Talab |
|---|:--:|---|
| **FR-ADM-01** | 🔴 | Moderatsiya navbati: sahifalash, filtr, qidiruv |
| **FR-ADM-02** | 🔴 | **[← BUG-D25]** Rad etishda **sabab majburiy** (ro'yxatdan tanlash + izoh). Prototipda sabab so'ralmasdi |
| **FR-ADM-03** | 🔴 | **[← BUG-D25]** Sotuvchi rad etish sababini **ko'radi** va tuzatib qayta yubora oladi |
| **FR-ADM-04** | 🔴 | **[← BUG-D25]** "Rad etilganlar" ro'yxati saqlanadi, qaror **ortga qaytarilishi** mumkin |
| **FR-ADM-05** | 🔴 | **[← BUG-D26]** Statistika **real hisoblanadi**. Prototipda "Platforma komissiyasi: 24,500,000 UZS" qotirilgan matn edi |
| **FR-ADM-06** | 🔴 | Barcha admin amallari **audit log** ga yoziladi (kim, qachon, nima) |
| **FR-ADM-07** | 🟠 | Foydalanuvchilarni boshqarish: qidiruv, bloklash, rol berish |
| **FR-ADM-08** | 🟠 | Shikoyatlar (report) navbati |
| **FR-ADM-09** | 🟠 | Moliyaviy hisobot: komissiya, eskrou qoldig'i, refund'lar |

---

## 5. MA'LUMOTLAR MODELI (`DM-*`)

> 🔴 **DM-04 [← BUG-38]** — **Yagona haqiqat manbai** prinsipi. Prototipda `nearbyPoi` ham qo'lda yozilgan, ham engine tomonidan hisoblanardi — ikkalasi mos kelmasdi.

### 5.1 Asosiy jadvallar

```
users              id(uuid), phone(uniq), name, avatar_url, role,
                   status, language, region_id, created_at, updated_at

regions            id, code, name_uz_latn, name_uz_cyrl, name_ru
districts          id, region_id, name_uz_latn, name_uz_cyrl, name_ru

properties         id(uuid), seller_id, title, description,
                   category, deal_type, price, currency,
                   area, rooms, floor, total_floors, build_year,
                   region_id, district_id, address, lat, lng,
                   status, is_vip, view_count,
                   created_at, updated_at, published_at

property_images    id, property_id, url, sort_order, is_cover
panoramas          id, property_id, room_name, url, sort_order

pois               id, osm_id, type, name, lat, lng, cached_at
property_pois      property_id, poi_id, distance_m, walk_min, computed_at

favorites          user_id, property_id, created_at
chats              id(uuid), property_id, buyer_id, seller_id, created_at
messages           id(uuid), chat_id, sender_id, type, body,
                   attachment_url, created_at, read_at

wallets            user_id, balance, currency, updated_at
transactions       id(uuid), wallet_id, type, amount, status,
                   external_ref, idempotency_key, created_at
deposits           id(uuid), property_id, buyer_id, seller_id,
                   amount, status, escrow_released_at, created_at

moderation_logs    id, property_id, admin_id, action, reason, created_at
audit_logs         id, actor_id, action, entity, entity_id,
                   payload, ip, created_at
```

### 5.2 Majburiy talablar

| ID | Prio | Talab |
|---|:--:|---|
| **DM-05** | 🔴 | **[← BUG-A6]** Pul `NUMERIC(18,2)` yoki butun **tiyin** sifatida. `FLOAT` **taqiqlanadi** |
| **DM-06** | 🔴 | **[← BUG-40]** Har bir jadvalda `created_at`, `updated_at` |
| **DM-07** | 🔴 | **[← BUG-16]** Barcha birlamchi kalitlar — **UUID** |
| **DM-08** | 🔴 | Indekslar: `properties(region_id, district_id, status)`, `properties(price)`, `properties(created_at)`, geo-indeks `(lat, lng)` — **PostGIS** |
| **DM-09** | 🔴 | **[← BUG-39]** `properties.rooms` (xonalar soni) va `panoramas` (360° rasmlar) — **nomlari aralashmasin**. Prototipda `rooms` va `rooms360` chalkashlik tug'dirardi |
| **DM-10** | 🟠 | Soft delete (`deleted_at`) — e'lonlar va foydalanuvchilar uchun |

---

## 6. TRACK 1 — UX / UI

### 6.1 Dizayn tizimi

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-UX-01** | 🔴 | **[← BUG-№1 (style.css yo'q edi)]** Dizayn tizimi **kod bazasida** saqlanadi (design tokens), bitta yo'qolgan fayl butun mahsulotni o'ldirmaydi |
| **NFR-UX-02** | 🔴 | Ranglar, shrift, spacing, radius, shadow — **token** sifatida (CSS custom properties yoki Tailwind config) |
| **NFR-UX-03** | 🔴 | **8px grid** tizimi: 4, 8, 12, 16, 24, 32, 48, 64 |
| **NFR-UX-04** | 🔴 | Maksimum **2 ta shrift oilasi** |
| **NFR-UX-05** | 🔴 | Har bir komponent uchun **barcha holatlar**: default, hover, focus, active, disabled, loading, error, empty |
| **NFR-UX-06** | 🟠 | Light va Dark rejim ikkalasi ham. **Light — sukut bo'yicha**: fotosurat oq fonda haqiqatga yaqinroq ko'rinadi, bu ishonchga qurilgan mahsulot uchun muhim |
| **NFR-UX-17** | 🔴 | Kontrast **render qilingan sahifada**, eng yomon haqiqiy fonga nisbatan o'lchanadi va **CI da avtomatlashtiriladi**. Faqat `#FFFFFF` ga nisbatan tekshirish taqiqlanadi — bu 4 ta yiqilishni yashirgan edi (DESIGN_SYSTEM §3.3) |
| **NFR-UX-18** | 🔴 | Har qanday shrift **kirill alifbosini qo'llashi shart**. Prototipdagi `Outfit` shu sababdan rad etildi; ru — MVP talabi (QAROR-5) |
| **NFR-UX-19** | 🔴 | Immersiv sirtlar (360° viewer, xarita) mavzudan **qat'i nazar qorong'i** (`.surface-immersive`) — u yerda media o'zi kontent |
| **NFR-UX-20** | 🔴 | "Tizim hisobladi" va "sotuvchi kiritdi" ma'lumoti **vizual jihatdan ajraladi** (`.data-computed` / `.data-claimed`). Bu — FR-MAP-09 ning ko'rinadigan ifodasi va mahsulotning farqlovchi g'oyasi |
| **NFR-UX-21** | 🔴 | Ichki standart: matn kontrasti ≥ **5.0** (AA talabi 4.5 + zaxira). 4.51 da turgan tizim birinchi o'zgarishda yiqiladi |

> 📎 To'liq amalga oshirilishi va o'lchov natijalari: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

### 6.2 Mobil (mobile-first)

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-UX-07** | 🔴 | **[← BUG-65]** **Mobile-first**. Prototipda `grid-template-columns: repeat(4, 1fr)` qotirilgan edi — telefonda buzilardi |
| **NFR-UX-08** | 🔴 | Barcha bosiladigan elementlar **≥ 44×44 px** |
| **NFR-UX-09** | 🔴 | Asosiy CTA — **pastki thumb-zone** da |
| **NFR-UX-10** | 🔴 | Input turlari to'g'ri: `tel`, `email`, `number` — mos klaviatura chiqsin |
| **NFR-UX-11** | 🟠 | Bottom navigation — mobil uchun |

### 6.3 Feedback va holatlar

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-UX-12** | 🔴 | **[← BUG-B13]** Toast tizimi — **navbat (queue)** bilan. Prototipda bitta element qayta ishlatilardi, taymer tozalanmasdi — xabarlar bir-birini erta o'chirardi |
| **NFR-UX-13** | 🔴 | **[← BUG-B15]** Faol navigatsiya holati to'g'ri ko'rsatilsin. Prototipda birinchi bosishdan keyin yo'qolardi |
| **NFR-UX-14** | 🔴 | Har bir async amalda loading holati |
| **NFR-UX-15** | 🔴 | Har bir ro'yxat uchun empty state: illyustratsiya + sarlavha + tavsif + CTA |
| **NFR-UX-16** | 🔴 | **404** va **500** sahifalari — professional, yo'nalish beruvchi |

### 6.4 Accessibility (WCAG 2.1 AA)

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-A11Y-01** | 🔴 | Matn/fon kontrasti **≥ 4.5:1** |
| **NFR-A11Y-02** | 🔴 | Barcha interaktiv elementlarga **Tab** bilan yetish mumkin, focus indikatori ko'rinadi |
| **NFR-A11Y-03** | 🔴 | **[← BUG-31]** Modal: **Esc bilan yopiladi**, fokus ichida ushlanadi (focus trap), yopilganda qaytadi. Prototipda Esc ishlamasdi |
| **NFR-A11Y-04** | 🔴 | Barcha rasmlarda `alt`, ikonkali tugmalarda `aria-label` |
| **NFR-A11Y-05** | 🔴 | Xato xabarlari `role="alert"` |
| **NFR-A11Y-06** | 🟠 | `prefers-reduced-motion` hurmat qilinadi (360° avto-aylanish o'chadi) |

### 6.5 Kontent va til

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-I18N-01** | 🔴 | **[← BUG-F38]** **uz-Latn va ru** — ikkala til MVP da. Prototipda faqat o'zbekcha, matnlar kodga qotirilgan edi |
| **NFR-I18N-02** | 🔴 | Barcha matnlar **tarjima fayllarida**, kodda qotirilmaydi |
| **NFR-I18N-03** | 🟠 | uz-Cyrl — keyingi iteratsiyada |
| **NFR-CNT-01** | 🔴 | CTA'lar aniq harakat bildiradi ("Yuborish" emas — "E'lonni moderatsiyaga yuborish") |
| **NFR-CNT-02** | 🔴 | Xato xabarlari texnik emas, nima qilish kerakligini aytadi |
| **NFR-CNT-03** | 🔴 | Placeholder'lar misol ko'rsatadi |

---

## 7. TRACK 2 — BACKEND

> ✅ **Tasdiqlangan** — §15 QAROR-1.

### 7.1 Backend stack

| Qatlam | Tanlov | Sabab |
|---|---|---|
| Runtime | **Node.js 22 LTS + TypeScript** | Frontend bilan bir til va **umumiy tip shartnomasi** (`packages/shared`) |
| Framework | **NestJS** | Modulli, DI, validatsiya built-in — 900 qatorli "God object" strukturaviy jihatdan imkonsiz |
| DB | **PostgreSQL 16 + PostGIS** | Geo-so'rovlar (radius, bbox) — loyihaning yadrosi |
| ORM | **Prisma** | Migratsiyalar, type-safety, `packages/shared` bilan mos |
| Kesh | **Redis** | Sessiya, rate limit, POI keshi |
| Fayl | **S3-mos** (MinIO → AWS S3) | Panoramalar og'ir — CDN shart |
| Real-time | **WebSocket** (Socket.io) | Chat |
| Navbat | **BullMQ** | POI hisoblash, rasm/panorama optimizatsiyasi, SMS |

**Monorepo strukturasi:**

```
apps/
  api/          NestJS backend
  web/          Next.js frontend
  worker/       BullMQ jobs (POI, media, SMS)
packages/
  shared/       TypeScript tiplar, Zod sxemalar, konstantalar
  ui/           Design tokens + komponent kutubxonasi
```

> **DM-11** 🔴 — `packages/shared` **yagona sxema manbai**. API DTO, frontend forma validatsiyasi va DB tiplari bir joydan keladi. Prototipdagi "ikkita haqiqat manbai" muammosi (`nearbyPoi` qo'lda + engine) strukturaviy jihatdan takrorlanmaydi.

### 7.2 API talablari

| ID | Prio | Talab |
|---|:--:|---|
| **FR-API-01** | 🔴 | REST, versiyalangan: `/api/v1/...` |
| **FR-API-02** | 🔴 | **OpenAPI/Swagger** spetsifikatsiyasi avtomatik generatsiya qilinadi |
| **FR-API-03** | 🔴 | Barcha ro'yxat endpointlari **sahifalangan** (`page`, `limit`, max 100) |
| **FR-API-04** | 🔴 | **[← BUG-11]** So'rov tanasi **sxema bilan validatsiya** qilinadi (Zod/class-validator). Validatsiyasiz endpoint qabul qilinmaydi |
| **FR-API-05** | 🔴 | Standart xato formati: `{ code, message, details }` |
| **FR-API-06** | 🔴 | **[← BUG-D22]** Moliyaviy endpointlarda **`Idempotency-Key`** header majburiy |
| **FR-API-07** | 🔴 | Strukturalangan JSON loglar (`pino`), `request_id` bilan |

### 7.3 Backend xavfsizligi

| ID | Prio | Talab |
|---|:--:|---|
| **SEC-02** | 🔴 | **[← BUG-03]** Avtorizatsiya **har bir endpointda serverda**. Frontend roli hech qachon ishonchli manba emas |
| **SEC-03** | 🔴 | **IDOR himoyasi**: foydalanuvchi faqat o'z resurslariga kira oladi. Har bir `GET /chats/:id` egalikni tekshiradi |
| **SEC-04** | 🔴 | **[← BUG-04]** Barcha chiqish ma'lumotlari escape qilinadi. `innerHTML` **taqiqlanadi** |
| **SEC-05** | 🔴 | SQL — faqat parametrlangan so'rovlar / ORM |
| **SEC-06** | 🔴 | Rate limiting: login, OTP, e'lon joylash, fayl yuklash, qidiruv |
| **SEC-07** | 🔴 | **[← BUG-51]** Secrets — `.env` da, repozitoriyada **hech qachon**. `.gitignore` tekshirilgan |
| **SEC-08** | 🔴 | Fayl yuklashda MIME **tarkib bo'yicha** tekshiriladi (kengaytma bo'yicha emas) |
| **SEC-09** | 🔴 | Parol yo'q (OTP), lekin admin uchun bo'lsa — **argon2** |
| **SEC-10** | 🔴 | Loglarda telefon, token, karta ma'lumoti **maskalangan** |
| **SEC-11** | 🟠 | CSP, HSTS, X-Frame-Options, X-Content-Type-Options header'lari |

---

## 8. TRACK 3 — FRONTEND

> ✅ **Tasdiqlangan** — §15 QAROR-2.

### 8.1 Frontend stack

| Qatlam | Tanlov | Sabab |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | **SSR/ISR** — e'lon sahifalari qidiruv botlari uchun (NFR-SEO-05). SPA da buni keyin qo'shish = qayta yozish |
| Routing | **Next.js file-based** | **[← BUG-8]** Prototipda router umuman yo'q edi, URL o'zgarmasdi |
| Rasm | **`next/image`** | **[← BUG-NFR-PERF-04]** Avtomatik WebP/AVIF, `srcset`, lazy, CLS himoyasi — media-og'ir loyiha uchun hal qiluvchi |
| Server state | **TanStack Query** | Kesh, retry, invalidatsiya |
| Client state | **Zustand** | Yengil, Context pollution'siz |
| Stil | **Tailwind + design tokens** | Tez, izchil |
| 3D | **Three.js** (joriy LTS) | 360° tur — **`dynamic(ssr:false)`** bilan faqat modal ochilganda yuklanadi |
| Xarita | **Leaflet + markercluster** | Yengil, OSM bilan mos, client-only |
| Formalar | **React Hook Form + Zod** | **[← BUG-A6, A8]** Zod sxemasi `packages/shared` dan |
| i18n | **next-intl** | uz / ru, SEO-mos marshrutlar (`/uz/...`, `/ru/...`) |

> **NFR-FE-10** 🔴 — Three.js va Leaflet **hech qachon** boshlang'ich bundle'ga kirmaydi. Ikkalasi ham `next/dynamic` orqali, `ssr: false` bilan. NFR-PERF-02 (< 200 KB) shu bilan ta'minlanadi.

### 8.2 Arxitektura talablari

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-FE-01** | 🔴 | **[← BUG-8]** **Haqiqiy routing.** URL har bir holatni aks ettiradi. Prototipda `innerHTML` almashardi, URL o'zgarmasdi, orqaga tugmasi ishlamasdi, e'lonni ulashib bo'lmasdi |
| **NFR-FE-02** | 🔴 | Deep-link: `/property/:id` to'g'ridan-to'g'ri ochiladi |
| **NFR-FE-03** | 🔴 | **[← BUG-F42]** Inline `onclick` **taqiqlanadi**. CSP `unsafe-inline` siz ishlashi shart |
| **NFR-FE-04** | 🔴 | **[← BUG-04]** `innerHTML` **taqiqlanadi**. Lint qoidasi bilan majburlanadi |
| **NFR-FE-05** | 🔴 | **[← BUG-F32, F33]** O'lik kod yo'q. Prototipda `currentFilter`, `selectedMarker`, `activeChat` e'lon qilingan, ishlatilmagan edi |
| **NFR-FE-06** | 🔴 | **Error Boundary** — bitta komponent xatosi butun ilovani o'ldirmasin |
| **NFR-FE-07** | 🔴 | **[← BUG-C19]** Har bir effekt/listener/WebGL resursi uchun **tozalash (cleanup)** yozilgan bo'lsin |
| **NFR-FE-08** | 🔴 | Fayl uzunligi ≤ 300 qator. **[← Prototipda `app.js` 900 qator "God object" edi]** |
| **NFR-FE-09** | 🔴 | `console.log` production build'da yo'q |

### 8.3 Performance (Core Web Vitals)

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-PERF-01** | 🔴 | **LCP < 2.5s**, **INP < 200ms**, **CLS < 0.1** (4G, o'rta darajali Android) |
| **NFR-PERF-02** | 🔴 | Boshlang'ich JS bundle **< 200 KB** (gzip). Three.js **faqat 360° modal ochilganda** yuklanadi (lazy import) |
| **NFR-PERF-03** | 🔴 | **[← BUG-63]** Barcha skriptlar `defer`/`async`. Prototipda Three.js (~600 KB) `<head>` da bloklab turardi |
| **NFR-PERF-04** | 🔴 | Rasmlar **WebP/AVIF**, `srcset` bilan responsive, `loading="lazy"` |
| **NFR-PERF-05** | 🔴 | Rasm o'lchamlari HTML da belgilangan (CLS oldini olish) |
| **NFR-PERF-06** | 🔴 | Panoramalar CDN orqali, bir necha sifat darajasida |
| **NFR-PERF-07** | 🟠 | Route-based code splitting |

### 8.4 SEO va ulashish

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-SEO-01** | 🔴 | **[← BUG-F34]** **Open Graph + Twitter Card** teglari har bir e'lon uchun. O'zbekistonda e'lon **Telegram orqali tarqaladi** — prototipda ulashilsa bo'sh ko'rinardi |
| **NFR-SEO-02** | 🔴 | **[← BUG-F35]** `robots.txt`, `sitemap.xml` (dinamik generatsiya) |
| **NFR-SEO-03** | 🔴 | **[← BUG-58]** Favicon to'plami: 16, 32, 180, 192, 512 px |
| **NFR-SEO-04** | 🔴 | Har bir sahifada noyob `<title>` va `meta description` |
| **NFR-SEO-05** | 🔴 | E'lon sahifalari **SSR yoki prerender** — qidiruv botlari uchun |
| **NFR-SEO-06** | 🟠 | `Schema.org` — `RealEstateListing` mikro-belgilash |
| **NFR-SEO-07** | 🟠 | Canonical URL |

### 8.5 Offline va sekin tarmoq

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-NET-01** | 🔴 | Internet uzilganda aniq xabar |
| **NFR-NET-02** | 🔴 | Barcha API so'rovlarida timeout va retry |
| **NFR-NET-03** | 🟠 | 3G da katalog < 5s da ochilsin |

---

## 9. TRACK 4 — DEVOPS

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-OPS-01** | 🔴 | **[← BUG-№1]** **Build tekshiruvi CI da.** Prototipda `style.css` yo'qligini hech narsa aniqlamadi — loyiha buzuq holda commit qilingan edi. CI yo'q bo'lgan fayl havolalarini ushlashi shart |
| **NFR-OPS-02** | 🔴 | Muhitlar: **dev / staging / production** — alohida DB va secrets |
| **NFR-OPS-03** | 🔴 | Docker + `docker-compose` (lokal ishga tushirish bir buyruq bilan) |
| **NFR-OPS-04** | 🔴 | CI pipeline: `lint → typecheck → test → build → deploy` |
| **NFR-OPS-05** | 🔴 | **[← BUG-F41]** Bog'liqliklar **lock-fayl** bilan qotirilgan. CDN'dan skript yuklash **taqiqlanadi** (prototipda Three.js r128 — 2021 yilgi versiya, SRI hash'siz) |
| **NFR-OPS-06** | 🔴 | HTTPS hamma yerda, HSTS |
| **NFR-OPS-07** | 🔴 | Gzip/Brotli, to'g'ri cache header'lar |
| **NFR-OPS-08** | 🔴 | DB migratsiyalari versiyalangan va qaytariladigan |
| **NFR-OPS-09** | 🔴 | **Kunlik DB backup**, tiklash protsedurasi **sinovdan o'tgan** |
| **NFR-OPS-10** | 🔴 | Xato monitoringi — **Sentry** (frontend + backend) |
| **NFR-OPS-11** | 🔴 | Uptime monitoring + alert |
| **NFR-OPS-12** | 🟠 | Analytics (Plausible / GA4) |
| **NFR-OPS-13** | 🟠 | Core Web Vitals real foydalanuvchi monitoringi (RUM) |
| **NFR-OPS-14** | 🟠 | Blue-green yoki rolling deploy |

### 9.1 Huquqiy (relizga bloker)

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-LEG-01** | 🔴 | Ommaviy oferta |
| **NFR-LEG-02** | 🔴 | Maxfiylik siyosati (shaxsiy ma'lumotlar to'g'risidagi O'zbekiston qonunchiligiga muvofiq) |
| **NFR-LEG-03** | 🔴 | Foydalanuvchi shartnomasi |
| **NFR-LEG-04** | 🟠 | Cookie roziligi |

---

## 10. TRACK 5 — QA

| ID | Prio | Talab |
|---|:--:|---|
| **NFR-QA-01** | 🔴 | **[← Prototipda bitta ham test yo'q edi]** Test qamrovi: biznes mantiq **≥ 70%** |
| **NFR-QA-02** | 🔴 | Unit testlar: masofa hisoblash, narx konvertatsiyasi, validatsiya, filtr mantiqi |
| **NFR-QA-03** | 🔴 | Integratsion testlar: barcha API endpointlari |
| **NFR-QA-04** | 🔴 | E2E (Playwright) — asosiy oqimlar: ro'yxatdan o'tish → qidiruv → 360° tur → chat → avans |
| **NFR-QA-05** | 🔴 | **Regression to'plami** — quyidagi jadvaldagi har bir bug uchun test |
| **NFR-QA-06** | 🔴 | CI da testsiz merge **taqiqlanadi** |
| **NFR-QA-07** | 🟠 | Accessibility avtomatik testi (axe-core) |
| **NFR-QA-08** | 🟠 | Vizual regression testlari |
| **NFR-QA-09** | 🟠 | Yuk testi: 1000 parallel foydalanuvchi |

### 10.1 Majburiy regression test-case'lari

Quyidagilar prototipdagi real xatoliklar. **Har biri uchun avtomatik test yozilishi shart** — takrorlanmasligi kafolatlansin.

| ID | Test | Bog'liq talab |
|---|---|---|
| REG-01 | Xaritada markerlar chiziladi (`clearMarkers` mavjud) | FR-MAP-10 |
| REG-02 | Xarita sahifasidan modal ochib yopilgach xarita ishlaydi | FR-MAP-11 |
| REG-03 | "4+ xonali" filtri 5 va 6 xonalilarni topadi | FR-CAT-04 |
| REG-04 | Ketma-ket 2 ta e'londa 2-si 1-sining koordinatasini olmaydi | FR-POST-07 |
| REG-05 | Joy belgilanmasa forma yuborilmaydi | FR-POST-06 |
| REG-06 | Yangi e'londa qavat foydalanuvchi kiritganidek saqlanadi | FR-POST-05 |
| REG-07 | Narx `1e9` kiritilsa to'g'ri saqlanadi yoki rad etiladi | FR-POST-08 |
| REG-08 | Yangi sotuvchi avtomatik `verified` bo'lmaydi | FR-POST-09 |
| REG-09 | 10 ta 360° tur ketma-ket ochilsa WebGL konteksti tugamaydi | FR-TOUR-06 |
| REG-10 | Yangi uy ochilganda kamera boshlang'ich burchakda | FR-TOUR-08 |
| REG-11 | `panoramas` bo'sh bo'lsa sahifa qulamaydi | FR-TOUR-09 |
| REG-12 | Panorama URL buzuq bo'lsa xato holati ko'rsatiladi | FR-TOUR-05 |
| REG-13 | Chatda xabar yuborilgach lenta pastga scroll qiladi | FR-CHAT-02 |
| REG-14 | Sotuvchi rolida yuborilgan xabar `seller` sifatida saqlanadi | FR-CHAT-01 |
| REG-15 | Sotuvchi o'zi bilan chat ocholmaydi | FR-CHAT-04 |
| REG-16 | Avans tugmasi 2 marta bosilsa 1 marta yechiladi | FR-PAY-04 |
| REG-17 | Avans summasi uy narxiga mutanosib | FR-PAY-02 |
| REG-18 | Rad etilgan e'lon sababi bilan saqlanadi va tiklanadi | FR-ADM-02,04 |
| REG-19 | Sevimlilar sahifasi ochiladi | FR-FAV-01 |
| REG-20 | Sevimliga bosilganda scroll pozitsiyasi saqlanadi | FR-CAT-10 |
| REG-21 | Samarqand uyi uchun Toshkent POI'lari chiqmaydi (2km radius) | FR-MAP-05 |
| REG-22 | Chat XSS: `<img onerror>` matn sifatida ko'rinadi | SEC-04 |
| REG-23 | Buyer roli e'lon joylash API'siga kira olmaydi | SEC-02 |
| REG-24 | Foydalanuvchi A, B ning chatini o'qiy olmaydi | SEC-03 |
| REG-25 | Sahifa yangilangach filtr va sevimlilar saqlanadi | FR-CAT-09, FR-FAV-02 |
| REG-26 | Navigatsiyaning faol holati to'g'ri ko'rsatiladi | NFR-UX-13 |
| REG-27 | 3 ta toast ketma-ket to'g'ri ko'rsatiladi | NFR-UX-12 |
| REG-28 | Modal Esc bilan yopiladi, fokus qaytadi | NFR-A11Y-03 |
| REG-29 | Orqaga tugmasi to'g'ri ishlaydi | NFR-FE-01 |
| REG-30 | Chat badge o'qilmagan sonini ko'rsatadi | FR-CHAT-05 |

---

## 11. QABUL MEZONLARI (`AC-*`)

MVP **faqat quyidagilar bajarilganda** tayyor deb hisoblanadi:

| ID | Mezon |
|---|---|
| **AC-01** | Barcha 🔴 P0 talablar bajarilgan |
| **AC-02** | 30 ta regression testining barchasi o'tadi |
| **AC-03** | Test qamrovi ≥ 70% |
| **AC-04** | Lighthouse: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90 (mobil) |
| **AC-05** | Core Web Vitals maqsadlariga erishilgan (4G, o'rta Android) |
| **AC-06** | Kritik va yuqori darajadagi xavfsizlik zaifligi yo'q |
| **AC-07** | 14 ta hududning barchasi tizimda, kamida 3 tasida real e'lon bilan sinovdan o'tgan |
| **AC-08** | uz va ru tillari to'liq |
| **AC-09** | To'lov oqimi Payme/Click sandbox'ida uchdan-uchiga sinovdan o'tgan |
| **AC-10** | Huquqiy hujjatlar joylashtirilgan |
| **AC-11** | Backup va tiklash amalda sinovdan o'tgan |
| **AC-12** | Sentry, uptime monitoring ishlayapti |

---

## 12. BOSQICHLAR

| Bosqich | Mazmun | Natija |
|---|---|---|
| **0. Poydevor** | Repo strukturasi, CI, Docker, DB sxemasi, migratsiyalar, design tokens | `docker-compose up` bilan ishlaydigan bo'sh skelet |
| **1. Backend yadro** | Auth (OTP), hududlar seed, properties CRUD, fayl yuklash, POI engine | Swagger'da sinaladigan API |
| **2. Frontend yadro** | Routing, katalog, filtr, e'lon sahifasi, 360° viewer, xarita | Ko'rish mumkin bo'lgan mahsulot |
| **3. O'zaro aloqa** | Chat (WS), sevimlilar, e'lon joylash formasi, moderatsiya paneli | To'liq oqim |
| **4. Sayqal** | i18n (uz/ru), SEO, a11y, performance, E2E, yuk testi | **MVP reliz nomzodi** |
| **5. v2.0** | To'lovlar: hamyon, Payme/Click, eskrou, tranzaksiyalar | Monetizatsiya (MVP dan keyin) |

> Har bir bosqich oxirida — **QA gate**. O'tmasa keyingisiga o'tilmaydi.

---

## 13. OCHIQ SAVOLLAR

### 13.1 Hal qilindi (§15)

| № | Savol | Qaror |
|---|---|---|
| 1 | Backend stack | ✅ Node 22 + TS + NestJS + PostgreSQL/PostGIS |
| 3 | To'lov MVP ga kiradimi | ✅ Yo'q — v2.0 ga |
| 5 | Panoramani kim tayyorlaydi | ✅ Gibrid: sotuvchi yuklaydi (majburiy) + Toshkentda pullik xizmat |
| 6 | Ijara MVP ga kiradimi | ✅ Ha |

### 13.2 Ochiq qolgan (0-bosqichni to'smaydi, 1-bosqichgacha kerak)

| № | Savol | Ta'siri | Muddat |
|---|---|---|---|
| 2 | Hosting qayerda? | Shaxsiy ma'lumotlar lokalizatsiyasi — O'zbekiston qonunchiligi fuqarolar ma'lumotlarini mamlakat hududida saqlashni talab qiladi | 1-bosqich boshigacha |
| 4 | Eskrou huquqiy jihatdan mumkinmi? Litsenziya kerakmi? | v2.0 umuman mumkinligini belgilaydi | v2.0 rejalashtirishgacha |
| 7 | SMS provayderi (Eskiz / Play Mobile)? | Auth moduli — 1-bosqich | 1-bosqich boshigacha |
| 8 | Yuridik shaxs bormi (huquqiy hujjatlar va to'lov shartnomasi uchun)? | NFR-LEG-01…03 | Relizgacha |

---

## 14-A. MVP MONETIZATSIYASI (to'lovsiz)

> To'lov moduli v2.0 ga ko'chirilgani sababli MVP daromad modeli qayta belgilandi.

| ID | Prio | Talab |
|---|:--:|---|
| **FR-MON-01** | 🔴 | Asosiy konversiya metrikasi — **sotuvchiga murojaat** (chat ochilishi yoki telefon ko'rsatilishi). Bu MVP gipotezasini o'lchaydigan raqam |
| **FR-MON-02** | 🟠 | **VIP e'lon** — pullik ko'tarish. To'lov MVP da **qo'lda** (admin tasdiqlaydi), avtomatlashtirish v2.0 da |
| **FR-MON-03** | 🟠 | **Panorama suratga olish xizmati** — Toshkentda pullik, ariza formasi orqali |
| **FR-MON-04** | 🔴 | Telefon raqami **faqat ro'yxatdan o'tgan foydalanuvchiga** ko'rsatiladi — lead sifatini o'lchash uchun |

---

## 14. TALAB ↔ PROTOTIP XATOLIGI XARITASI

Prototip auditida topilgan **50 ta kamchilikning barchasi** shu TZ ga kiritildi:

| Xatolik guruhi | Soni | Qamrab olgan talablar |
|---|:--:|---|
| Crash / ishlamaydigan | 3 | FR-MAP-10, FR-FAV-01, NFR-OPS-01 |
| Ma'lumot buzilishi | 7 | FR-POST-02…10 |
| Hududiy miqyos | 5 | DM-01…03, FR-MAP-02…09 |
| Masshtab | 5 | FR-CAT-05,06, FR-MAP-12,13, FR-CHAT-03 |
| Moliyaviy mantiq | 6 | FR-PAY-02…11 |
| UI/UX buzuqliklari | 8 | NFR-UX-12,13, FR-CAT-04,10,11, FR-TOUR-08,11, FR-CHAT-02,05 |
| Ishonchlilik | 5 | FR-TOUR-04…10 |
| Xavfsizlik | 4 | SEC-01…04 |
| Infratuzilma / SEO | 7 | NFR-SEO-01…04, NFR-OPS-05, NFR-FE-03 |

---

## 15. ARXITEKTURA QARORLARI (ADR)

> Har bir qaror **"loyiha kattalashadi"** mezoni bo'yicha baholandi: bugun arzon, ertaga qimmatga tushadigan qarorlar hozir qabul qilinadi.

### QAROR-1 — Backend: Node 22 + TypeScript + NestJS + PostgreSQL/PostGIS

**Muqobillar:** Python/FastAPI · PHP/Laravel

**Tanlov sababi:**
- **PostGIS majburiy.** POI radius va xarita `bbox` so'rovlari — mahsulotning farqlovchi yadrosi. Ilova kodida hisoblash bir necha ming yozuvdan keyin qulaydi. MySQL geo imkoniyatlari yetarli emas → Laravel yo'nalishi shu yerda yiqiladi.
- **Bitta til.** Frontend ham TypeScript → `packages/shared` orqali **tip va validatsiya sxemasi bir manbadan**. Prototipdagi asosiy kasallik — ikkita haqiqat manbai — strukturaviy jihatdan yo'q qilinadi.
- **NestJS modulliligi.** Prototip 900 qatorli `app.js` "God object" dan o'ldi. NestJS da modul/servis/kontroller ajratilishi majburiy — jamoa 3 kishidan 15 kishiga o'sganda ham struktura saqlanadi.
- **WebSocket native.** Chat uchun qo'shimcha infratuzilma kerak emas.

**Zaif tomoni va yechimi:** CPU-og'ir panorama qayta ishlash Node uchun noqulay → alohida `apps/worker` (BullMQ) ga chiqariladi, kerak bo'lsa keyinchalik boshqa tilga ko'chirish mumkin — API ga ta'sir qilmaydi.

### QAROR-2 — Frontend: Next.js (App Router) + TypeScript

**Muqobillar:** React+Vite (SPA) · Vue 3

**Tanlov sababi:**
- **SEO — hayot-mamot masalasi.** Ko'chmas mulk marketplace'ining asosiy trafigi organik qidiruvdan keladi. `NFR-SEO-05` SSR/prerender talab qiladi. SPA ga SSR ni keyin qo'shish = qayta yozish.
- **`next/image`.** Loyiha media-og'ir: har e'londa 3+ foto va 360° panorama. Avtomatik WebP/AVIF, `srcset`, CLS himoyasi — qo'lda qurishning hojati yo'q.
- **ISR.** E'lon sahifalari statik generatsiya qilinib, o'zgarganda yangilanadi — 5000+ e'londa server yuki keskin kamayadi.
- **Ijara va ko'p tilli marshrutlar** (`/uz/ijara/samarqand`, `/ru/arenda/samarkand`) file-based routing bilan tabiiy chiqadi.

**Zaif tomoni va yechimi:** App Router murakkabroq. Three.js va Leaflet SSR bilan mos emas → `dynamic(ssr:false)` bilan izolyatsiya qilinadi (`NFR-FE-10`).

### QAROR-3 — To'lov moduli v2.0 ga ko'chirildi

**Tanlov sababi:**
- **Huquqiy noaniqlik.** Eskrou — uchinchi shaxs pulini ushlab turish. O'zbekistonda bu litsenziyalanadigan faoliyatga kirishi mumkin (ochiq savol №4). Hal qilinmagan masalaga kod yozish — yo'qotilgan vaqt.
- **Gipoteza mos kelmaydi.** MVP javob berishi kerak bo'lgan savol: *"360° tur va avtomatik POI xaridorni sotuvchiga murojaat qilishga undaydimi?"* Buni o'lchash uchun to'lov kerak emas — chat va telefon yetarli (`FR-MON-01`).
- **Eng katta blok.** To'lovlar MVP hajmining taxminan uchdan birini tashkil qiladi. Chiqarilsa reliz sezilarli darajada tezlashadi.

**Muhim shart:** `wallets`, `transactions`, `deposits` jadvallari **hozirdan sxemaga kiritiladi** (§5.1). v2.0 da ma'lumot migratsiyasi kerak bo'lmaydi.

### QAROR-4 — Ijara MVP ga kiradi

**Tanlov sababi:** `deal_type` — ma'lumot modelidagi bitta enum. **Hozir kiritish arzon, keyin kiritish qimmat:** keyinchalik qo'shilsa DB migratsiyasi, barcha filtrlar, barcha URL'lar va SEO sahifalari qayta ko'rib chiqiladi. Ustiga ijara sotuvga qaraganda **tez-tez takrorlanadigan** bitim — foydalanuvchi qaytib kelish chastotasi yuqori.

> **FR-POST-15** 🔴 — `deal_type: 'sale' | 'rent'`. Ijara uchun qo'shimcha maydonlar: `rent_period` (oy/kun), `deposit_required`, `utilities_included`.
> **FR-CAT-14** 🔴 — Bitim turi — katalogdagi **birinchi darajali filtr** (narx mantiqи butunlay boshqacha).

### QAROR-5 — Rus tili MVP ga kiradi

**Tanlov sababi:** i18n ni keyin qo'shish — **har bir satrni qayta ko'rib chiqish** demakdir. 1-kundan `next-intl` bilan boshlansa qo'shimcha xarajat deyarli nolga teng. Bozorning sezilarli qismi ruschada muomala qiladi — bu auditoriyani boshidan yo'qotish mantiqsiz.

### QAROR-6 — Panorama: gibrid model, lekin **majburiy**

**Tanlov sababi:**
- **Ixtiyoriy qilinsa — mahsulot o'ladi.** Sotuvchilar qo'shimcha mehnatni o'tkazib yuboradi va platforma yomonroq olx.uz ga aylanadi. Farqlovchi xususiyat **majburlanishi** kerak.
- **Faqat platforma xizmati — masshtablanmaydi.** 14 hududda operator saqlash imkonsiz.

**Model:**

| Bosqich | Yechim |
|---|---|
| MVP | Sotuvchi o'zi yuklaydi. **Panoramasiz e'lon chop etilmaydi** (`FR-POST-03`) |
| MVP | Kirish to'sig'ini pasaytirish: ilova ichida qo'llanma — telefon bilan 360° suratga olish (Google Street View, Kuula, Panorama 360) |
| MVP | Toshkentda **pullik suratga olish xizmati** — ariza formasi (`FR-MON-03`) |
| v2.0 | Xizmatni viloyatlarga bosqichma-bosqich kengaytirish |

**Tan olingan xavf:** majburiy panorama boshlang'ich e'lonlar oqimini sekinlashtiradi. Bu **ataylab qabul qilingan** — sifat miqdordan ustun, chunki mahsulotning butun qiymat taklifi ishonchga qurilgan.

> **FR-POST-16** 🔴 — Panorama yuklash sahifasida qo'llanma: qanday suratga olish, qaysi ilova, minimal sifat talablari (2:1 nisbat, ≥ 4000×2000 px).

### Qarorlarning umumiy mantig'i

| Qaror | "Hozir arzon, keyin qimmat" | Natija |
|---|---|---|
| PostGIS | Keyin ko'chirish = butun geo qatlamini qayta yozish | ✅ Hozir |
| Next.js SSR | Keyin qo'shish = frontend'ni qayta yozish | ✅ Hozir |
| `deal_type` | Keyin qo'shish = DB migratsiyasi + barcha filtrlar | ✅ Hozir |
| i18n | Keyin qo'shish = har bir satrni ko'rib chiqish | ✅ Hozir |
| To'lovlar | Keyin qo'shish = **sxema tayyor bo'lsa arzon** | ⏸️ v2.0 |

---

## 16. AI QATLAMI

> **Asosiy prinsip:** AI — **ko'rinmas infratuzilma**, marketing hikoyasi emas.
> Mahsulotning farqlovchi taklifi "360° tur + o'lchangan masofa = ishonch" bo'lib qoladi.
> "AI-powered" degan yorliq bu aniq va tekshirib bo'ladigan taklifni suyultiradi.

### 16.1 Ikkita buzilmas qoida

| № | Qoida | Sabab |
|---|---|---|
| **SEC-AI-01** 🔴 | **AI e'lonni rad eta olmaydi.** U faqat tartiblaydi va belgilaydi; yakuniy qaror — moderatorda | Noto'g'ri avtomatik rad etish = jahli chiqqan sotuvchi = yo'qolgan taklif |
| **SEC-AI-02** 🔴 | **AI chiqargan har qanday kontent belgilanadi** va foydalanuvchiga ko'rinadi | Yashirin AI kontenti — ishonchga qurilgan mahsulot uchun ikkiyuzlamachilik |

### 16.2 Uchinchi ishonch toifasi

Dizayn tizimida ikkita toifa bor edi. AI uchinchisini talab qiladi:

| Klass | Ma'nosi | Ko'rinishi |
|---|---|---|
| `.data-computed` | Tizim o'lchadi (POI masofasi) | Brend rangli |
| `.data-claimed` | Sotuvchi yozdi | Neytral |
| **`.data-generated`** 🆕 | **AI tayyorladi, sotuvchi hali tasdiqlamadi** | **Oltin ramka + "AI tayyorladi" yorlig'i** |

> **NFR-UX-22** 🔴 — AI tayyorlagan kontent **hech qachon to'g'ridan-to'g'ri chop etilmaydi**.
> Oqim: AI yozadi → sotuvchi ko'radi va tahrirlaydi → tasdiqlaydi → `.data-claimed` ga aylanadi
> (javobgarlik sotuvchiga o'tadi).

### 16.3 FR-AI-01…09 · Media moderatsiyasi (vision)

> Bu — majburiy panorama qoidasini (`FR-POST-03`) operatsion jihatdan mumkin qiladigan qism.
> **Busiz 14 hududga chiqib bo'lmaydi.**

| ID | Prio | Talab |
|---|:--:|---|
| **FR-AI-01** | 🔴 | Yuklangan rasm **haqiqatan equirectangular 360°** ekanini tekshirish (2:1 nisbat + chekka uzluksizligi) |
| **FR-AI-02** | 🔴 | Sifat nazorati: xiralik, qorong'ilik, kadr to'sib qo'yilgani |
| **FR-AI-03** | 🔴 | **Dublikat / o'g'irlangan e'lon aniqlash** — perceptual hash + vision embedding. O'zbekiston bozorida e'lonlar ko'p nusxalanadi |
| **FR-AI-04** | 🔴 | Nomaqbul kontent aniqlash |
| **FR-AI-05** | 🔴 | **Maxfiylik: yuz va avtomobil raqamlarini avtomatik xiralashtirish** |
| **FR-AI-06** | 🔴 | Natija — **strukturaviy JSON** (`output_config.format`), erkin matn emas |
| **FR-AI-07** | 🔴 | **[← SEC-AI-01]** Chiqish: `auto_approve` / `needs_review` / `flag` + ishonch darajasi + sabab. **`reject` yo'q** |
| **FR-AI-08** | 🟠 | Ishonch past bo'lsa — kuchliroq modelga eskalatsiya |
| **FR-AI-09** | 🟠 | Navbat orqali asinxron (`apps/worker`), yuklashni bloklamaydi |

### 16.4 FR-AI-10…16 · Tavsif yaratish (uz + ru)

> Majburiy panorama qo'shgan friksiyani qoplaydi va bir vaqtda **SEO** hamda **rus tili** muammosini hal qiladi.

| ID | Prio | Talab |
|---|:--:|---|
| **FR-AI-10** | 🔴 | Strukturaviy ma'lumot + hisoblangan POI dan tavsif yaratish |
| **FR-AI-11** | 🔴 | **uz va ru — ikkalasi mustaqil yoziladi**, tarjima emas |
| **FR-AI-12** | 🔴 | **[← NFR-UX-22]** Natija `.data-generated` holatida ko'rsatiladi, sotuvchi tasdiqlagunicha chop etilmaydi |
| **FR-AI-13** | 🔴 | **AI faqat tizimda mavjud faktlardan foydalanadi.** Mavjud bo'lmagan xususiyat o'ylab topilmaydi (masalan "yaqinda metro bor" — agar POI da yo'q bo'lsa) |
| **FR-AI-14** | 🔴 | **⚠️ O'zbek tili sifati rus tilidan pastroq** — shuning uchun sotuvchi tasdig'i majburiy |
| **FR-AI-15** | 🟠 | Prompt caching — ko'rsatmalar prefiksi keshlanadi |
| **FR-AI-16** | 🟠 | SEO: har bir e'lon uchun noyob `meta description` ham shu chaqiruvda |

### 16.5 FR-AI-20…23 · Xona teglash va alt-matn

> Deyarli bepul: **16.3 dagi vision chaqiruvi bilan bir xil so'rovda** bajariladi.

| ID | Prio | Talab |
|---|:--:|---|
| **FR-AI-20** | 🟠 | Panoramadan xona turi aniqlanadi (yotoqxona / oshxona / mehmonxona / hammom / balkon) |
| **FR-AI-21** | 🟠 | Sotuvchi taklif qilingan tegni o'zgartira oladi |
| **FR-AI-22** | 🟠 | **[← NFR-A11Y-04]** Har bir rasm uchun `alt` matni avtomatik yaratiladi (uz + ru) |
| **FR-AI-23** | 🟡 | Ta'mir holati bahosi (yangi / ta'mirli / ta'mir talab qiladi) — sotuvchi tasdig'i bilan |

### 16.6 Model tanlovi va xarajat

| Vazifa | Model | Sabab |
|---|---|---|
| Moderatsiya — birlamchi saralash | **Haiku 4.5** (`claude-haiku-4-5`) | Arzon, tez, katta hajm uchun |
| Moderatsiya — shubhali holatlar | **Opus 5** (`claude-opus-5`) | Faqat ishonch past bo'lganda (~10%) |
| Tavsif yaratish (uz + ru) | **Sonnet 5** (`claude-sonnet-5`) | Ko'p tilli sifat / narx muvozanati |

**Optimizatsiya:** moderatsiya navbati **Batch API** orqali (−50%), tavsif yaratishda **prompt caching**.

**Hisoblangan xarajat:**

| Miqyos | Moderatsiya | Tavsif | Jami |
|---|---|---|---|
| MVP (800 rasm, 200 e'lon / oy) | ~$4 | ~$2 | **~$6 / oy** |
| 10× (40 000 rasm, 10 000 e'lon / oy) | ~$150 | ~$92 | **~$242 / oy** |

> Xulosa: AI qatlami **xarajat to'sig'i emas**. Yagona mezon — MVP gipotezasiga xizmat qiladimi.

### 16.7 v1 ga KIRMAYDIGAN AI

| Nima | Nima uchun yo'q |
|---|---|
| ❌ **Narx bahosi** | MVP da ~500 e'lon, 14 hududga taqsimlangan — model uchun yetarli emas. **Yomon narx bahosi ishonchni buzadi**, ya'ni mahsulotning maqsadiga qarshi ishlaydi. Ma'lumot to'plangach v2.0 da |
| ❌ **Chatda avtomatik javob** | Sotuvchi tasdiqlamagan da'vo — huquqiy va ishonch muammosi. Uy haqidagi ma'lumot faqat egasidan chiqadi |
| ❌ **"AI yordamchi" chatbot** | Foydalanuvchi ehtiyoji yo'q. Faqat "bizda ham AI bor" deyish uchun qo'shiladigan narsa |

---

**Hujjat oxiri.** Har qanday o'zgarish versiya raqamini oshirish bilan kiritiladi.
