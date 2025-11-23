ALTER TABLE "leads" ADD COLUMN "first_name" text;
ALTER TABLE "leads" ADD COLUMN "last_name" text;
-- Optional: Copy existing name data to first_name
UPDATE "leads" SET "first_name" = "name";
ALTER TABLE "leads" DROP COLUMN "name";
