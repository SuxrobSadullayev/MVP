# `docker-entrypoint-initdb.d`

Bu katalog konteyner **birinchi marta** ko'tarilganda ishlaydigan SQL uchun.

⚠️ **Kengaytmalar (PostGIS, uuid-ossp, pg_trgm, unaccent) bu yerda YARATILMAYDI.**

Ular `prisma/schema.prisma` dagi `datasource.extensions` da e'lon qilingan va
migratsiyalar tomonidan yaratiladi. Ikkala joyda yaratish "drift" ga olib keladi:
Prisma ma'lumotlar bazasini o'z migratsiya tarixiga mos kelmaydi deb hisoblaydi.

**Yagona manba — Prisma sxemasi.**
