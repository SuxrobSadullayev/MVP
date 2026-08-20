-- ==========================================================================
-- FR-CAT-08 — qidiruv taxalluslari
-- --------------------------------------------------------------------------
-- Muammo: foydalanuvchi viloyat emas, MARKAZ SHAHAR nomini yozadi.
-- Tekshiruvda 13 ta markazdan 7 tasi topilmadi:
--   Бухара, Фергана, Карши, Гулистан, Термез, Ургенч, Нукус
-- ==========================================================================

-- AlterTable
ALTER TABLE "districts" ADD COLUMN     "search_aliases" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "regions" ADD COLUMN     "search_aliases" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- RenameIndex
ALTER INDEX "districts_name_ru_trgm" RENAME TO "districts_name_ru_idx";

-- RenameIndex
ALTER INDEX "districts_name_uz_cyrl_trgm" RENAME TO "districts_name_uz_cyrl_idx";

-- RenameIndex
ALTER INDEX "districts_name_uz_latn_trgm" RENAME TO "districts_name_uz_latn_idx";

-- RenameIndex
ALTER INDEX "properties_address_trgm" RENAME TO "properties_address_idx";

-- RenameIndex
ALTER INDEX "properties_title_trgm" RENAME TO "properties_title_idx";

-- RenameIndex
ALTER INDEX "regions_name_ru_trgm" RENAME TO "regions_name_ru_idx";

-- RenameIndex
ALTER INDEX "regions_name_uz_cyrl_trgm" RENAME TO "regions_name_uz_cyrl_idx";

-- RenameIndex
ALTER INDEX "regions_name_uz_latn_trgm" RENAME TO "regions_name_uz_latn_idx";

