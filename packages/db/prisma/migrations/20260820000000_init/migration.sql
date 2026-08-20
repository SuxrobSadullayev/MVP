-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('buyer', 'seller', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'blocked', 'pending_seller');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('uz', 'ru');

-- CreateEnum
CREATE TYPE "DealType" AS ENUM ('sale', 'rent');

-- CreateEnum
CREATE TYPE "PropertyCategory" AS ENUM ('new_building', 'secondary', 'cottage', 'commercial');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('draft', 'pending', 'approved', 'rejected', 'archived', 'sold');

-- CreateEnum
CREATE TYPE "RentPeriod" AS ENUM ('monthly', 'daily');

-- CreateEnum
CREATE TYPE "PoiType" AS ENUM ('school', 'kindergarten', 'university', 'hospital', 'pharmacy', 'supermarket', 'bazaar', 'bank', 'metro', 'bus_stop', 'park', 'fuel');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'image', 'file', 'system');

-- CreateEnum
CREATE TYPE "ModerationVerdict" AS ENUM ('auto_approve', 'needs_review', 'flag');

-- CreateEnum
CREATE TYPE "AiGenerationKind" AS ENUM ('description', 'room_tag', 'alt_text');

-- CreateEnum
CREATE TYPE "AiGenerationStatus" AS ENUM ('pending', 'accepted', 'discarded');

-- CreateEnum
CREATE TYPE "ModerationAction" AS ENUM ('approve', 'reject', 'request_changes', 'restore');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('topup', 'withdrawal', 'deposit_hold', 'deposit_release', 'deposit_refund', 'commission');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'succeeded', 'failed', 'reversed');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('held', 'released', 'refunded', 'disputed');

-- CreateTable
CREATE TABLE "regions" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name_uz_latn" TEXT NOT NULL,
    "name_uz_cyrl" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "center_lat" DECIMAL(10,7) NOT NULL,
    "center_lng" DECIMAL(10,7) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name_uz_latn" TEXT NOT NULL,
    "name_uz_cyrl" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'buyer',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "language" "Language" NOT NULL DEFAULT 'uz',
    "region_id" INTEGER,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "seller_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deal_type" "DealType" NOT NULL,
    "category" "PropertyCategory" NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "price_usd" DECIMAL(18,2),
    "currency" TEXT NOT NULL DEFAULT 'UZS',
    "rent_period" "RentPeriod",
    "deposit_required" DECIMAL(18,2),
    "utilities_included" BOOLEAN,
    "area" DECIMAL(10,2) NOT NULL,
    "rooms" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "total_floors" INTEGER NOT NULL,
    "build_year" INTEGER,
    "bathrooms" INTEGER,
    "region_id" INTEGER NOT NULL,
    "district_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DECIMAL(10,7) NOT NULL,
    "lng" DECIMAL(10,7) NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'draft',
    "is_vip" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "contact_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "alt_uz" TEXT,
    "alt_ru" TEXT,
    "phash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panoramas" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "room_tag_ai" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "phash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panoramas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pois" (
    "id" UUID NOT NULL,
    "osm_id" BIGINT,
    "type" "PoiType" NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DECIMAL(10,7) NOT NULL,
    "lng" DECIMAL(10,7) NOT NULL,
    "cached_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pois_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_pois" (
    "property_id" UUID NOT NULL,
    "poi_id" UUID NOT NULL,
    "distance_m" INTEGER NOT NULL,
    "walk_min" INTEGER NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_pois_pkey" PRIMARY KEY ("property_id","poi_id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "user_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("user_id","property_id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "seller_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'text',
    "body" TEXT,
    "attachment_url" TEXT,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_moderations" (
    "id" UUID NOT NULL,
    "image_id" UUID,
    "panorama_id" UUID,
    "verdict" "ModerationVerdict" NOT NULL,
    "confidence" DECIMAL(4,3) NOT NULL,
    "reasons" JSONB NOT NULL DEFAULT '[]',
    "model" TEXT NOT NULL,
    "duplicate_of_image_id" UUID,
    "duplicate_of_panorama_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_moderations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_generations" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "kind" "AiGenerationKind" NOT NULL,
    "status" "AiGenerationStatus" NOT NULL DEFAULT 'pending',
    "content_uz" TEXT,
    "content_ru" TEXT,
    "model" TEXT NOT NULL,
    "input_tokens" INTEGER,
    "output_tokens" INTEGER,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_logs" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "action" "ModerationAction" NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "payload" JSONB,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "balance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'UZS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "amount" DECIMAL(18,2) NOT NULL,
    "external_ref" TEXT,
    "idempotency_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "seller_id" UUID NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "status" "DepositStatus" NOT NULL DEFAULT 'held',
    "escrow_released_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "regions_code_key" ON "regions"("code");

-- CreateIndex
CREATE INDEX "regions_code_idx" ON "regions"("code");

-- CreateIndex
CREATE INDEX "districts_region_id_idx" ON "districts"("region_id");

-- CreateIndex
CREATE UNIQUE INDEX "districts_region_id_code_key" ON "districts"("region_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE INDEX "properties_status_deal_type_region_id_district_id_idx" ON "properties"("status", "deal_type", "region_id", "district_id");

-- CreateIndex
CREATE INDEX "properties_status_created_at_idx" ON "properties"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "properties_status_price_idx" ON "properties"("status", "price");

-- CreateIndex
CREATE INDEX "properties_seller_id_idx" ON "properties"("seller_id");

-- CreateIndex
CREATE INDEX "property_images_property_id_sort_order_idx" ON "property_images"("property_id", "sort_order");

-- CreateIndex
CREATE INDEX "property_images_phash_idx" ON "property_images"("phash");

-- CreateIndex
CREATE INDEX "panoramas_property_id_sort_order_idx" ON "panoramas"("property_id", "sort_order");

-- CreateIndex
CREATE INDEX "panoramas_phash_idx" ON "panoramas"("phash");

-- CreateIndex
CREATE UNIQUE INDEX "pois_osm_id_key" ON "pois"("osm_id");

-- CreateIndex
CREATE INDEX "pois_type_idx" ON "pois"("type");

-- CreateIndex
CREATE INDEX "property_pois_property_id_distance_m_idx" ON "property_pois"("property_id", "distance_m");

-- CreateIndex
CREATE INDEX "favorites_user_id_created_at_idx" ON "favorites"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "chats_buyer_id_updated_at_idx" ON "chats"("buyer_id", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "chats_seller_id_updated_at_idx" ON "chats"("seller_id", "updated_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "chats_property_id_buyer_id_key" ON "chats"("property_id", "buyer_id");

-- CreateIndex
CREATE INDEX "messages_chat_id_created_at_idx" ON "messages"("chat_id", "created_at");

-- CreateIndex
CREATE INDEX "messages_chat_id_read_at_idx" ON "messages"("chat_id", "read_at");

-- CreateIndex
CREATE INDEX "media_moderations_verdict_created_at_idx" ON "media_moderations"("verdict", "created_at");

-- CreateIndex
CREATE INDEX "media_moderations_image_id_idx" ON "media_moderations"("image_id");

-- CreateIndex
CREATE INDEX "media_moderations_panorama_id_idx" ON "media_moderations"("panorama_id");

-- CreateIndex
CREATE INDEX "ai_generations_property_id_kind_status_idx" ON "ai_generations"("property_id", "kind", "status");

-- CreateIndex
CREATE INDEX "moderation_logs_property_id_created_at_idx" ON "moderation_logs"("property_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "moderation_logs_admin_id_created_at_idx" ON "moderation_logs"("admin_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_entity_entity_id_idx" ON "audit_logs"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs"("actor_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_idempotency_key_key" ON "transactions"("idempotency_key");

-- CreateIndex
CREATE INDEX "transactions_wallet_id_created_at_idx" ON "transactions"("wallet_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "deposits_property_id_idx" ON "deposits"("property_id");

-- CreateIndex
CREATE INDEX "deposits_buyer_id_created_at_idx" ON "deposits"("buyer_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "deposits_status_idx" ON "deposits"("status");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panoramas" ADD CONSTRAINT "panoramas_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_pois" ADD CONSTRAINT "property_pois_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_pois" ADD CONSTRAINT "property_pois_poi_id_fkey" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_moderations" ADD CONSTRAINT "media_moderations_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "property_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_moderations" ADD CONSTRAINT "media_moderations_panorama_id_fkey" FOREIGN KEY ("panorama_id") REFERENCES "panoramas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_logs" ADD CONSTRAINT "moderation_logs_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_logs" ADD CONSTRAINT "moderation_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ==========================================================================
-- POSTGIS GEO QATLAMI  (TZ DM-08, QAROR-1)
-- --------------------------------------------------------------------------
-- Prisma `geography` tipini yarata olmaydi, shuning uchun qo'lda qo'shiladi.
--
-- `geom` — GENERATED ALWAYS ustun: lat/lng dan avtomatik hisoblanadi va
-- ular o'zgarganda o'zi yangilanadi. Qo'lda yozib bo'lmaydi, ya'ni
-- koordinata va geometriya HECH QACHON bir-biriga zid bo'lmaydi.
--
-- Busiz POI radius so'rovi va xarita bbox so'rovi full-table scan bo'ladi.
-- ==========================================================================

ALTER TABLE "properties"
  ADD COLUMN "geom" geography(Point, 4326)
  GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint("lng"::double precision, "lat"::double precision), 4326)::geography
  ) STORED;

ALTER TABLE "pois"
  ADD COLUMN "geom" geography(Point, 4326)
  GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint("lng"::double precision, "lat"::double precision), 4326)::geography
  ) STORED;

-- GiST indekslari — ST_DWithin (POI radiusi) va bbox so'rovlari uchun
CREATE INDEX "properties_geom_idx" ON "properties" USING GIST ("geom");
CREATE INDEX "pois_geom_idx"       ON "pois"       USING GIST ("geom");

-- ==========================================================================
-- MATN QIDIRUVI  (TZ FR-CAT-08)
-- --------------------------------------------------------------------------
-- "Buxoro" / "Бухара" / "Bukhara" — uchala yozuvda ham topilishi kerak.
-- pg_trgm indekslari ILIKE va o'xshashlik so'rovlarini tezlashtiradi.
-- ==========================================================================

CREATE INDEX "regions_name_uz_latn_trgm"   ON "regions"   USING GIN ("name_uz_latn" gin_trgm_ops);
CREATE INDEX "regions_name_uz_cyrl_trgm"   ON "regions"   USING GIN ("name_uz_cyrl" gin_trgm_ops);
CREATE INDEX "regions_name_ru_trgm"        ON "regions"   USING GIN ("name_ru" gin_trgm_ops);
CREATE INDEX "districts_name_uz_latn_trgm" ON "districts" USING GIN ("name_uz_latn" gin_trgm_ops);
CREATE INDEX "districts_name_uz_cyrl_trgm" ON "districts" USING GIN ("name_uz_cyrl" gin_trgm_ops);
CREATE INDEX "districts_name_ru_trgm"      ON "districts" USING GIN ("name_ru" gin_trgm_ops);
CREATE INDEX "properties_title_trgm"       ON "properties" USING GIN ("title" gin_trgm_ops);
CREATE INDEX "properties_address_trgm"     ON "properties" USING GIN ("address" gin_trgm_ops);

-- ==========================================================================
-- MA'LUMOT BUTUNLIGI — prototipdagi xatolarni BAZA DARAJASIDA bloklash
-- ==========================================================================

-- FR-POST-08: manfiy yoki nol narx qabul qilinmaydi
ALTER TABLE "properties" ADD CONSTRAINT "properties_price_positive" CHECK ("price" > 0);
ALTER TABLE "properties" ADD CONSTRAINT "properties_area_positive"  CHECK ("area" > 0);
ALTER TABLE "properties" ADD CONSTRAINT "properties_rooms_positive" CHECK ("rooms" > 0);

-- Prototipda qavat 5/12 qotirilgan edi va hech narsa tekshirmasdi.
-- FR-POST-05: qavat binodagi qavatlar sonidan katta bo'la olmaydi.
ALTER TABLE "properties" ADD CONSTRAINT "properties_floor_valid"
  CHECK ("floor" >= 1 AND "total_floors" >= 1 AND "floor" <= "total_floors");

-- FR-POST-06: koordinata O'zbekiston chegarasida bo'lishi kerak.
-- Prototipda belgilanmagan e'lon jimgina Toshkent markaziga tushardi.
ALTER TABLE "properties" ADD CONSTRAINT "properties_coords_in_uzbekistan"
  CHECK ("lat" BETWEEN 37.0 AND 45.7 AND "lng" BETWEEN 55.9 AND 73.2);

-- FR-MAP-05: 2 km radius. Undan uzoq obyekt "yaqin-atrofda" emas.
ALTER TABLE "property_pois" ADD CONSTRAINT "property_pois_within_radius"
  CHECK ("distance_m" >= 0 AND "distance_m" <= 2000);

-- FR-PAY: pul manfiy bo'lmaydi
ALTER TABLE "wallets"  ADD CONSTRAINT "wallets_balance_non_negative" CHECK ("balance" >= 0);
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_amount_positive"     CHECK ("amount" > 0);
