


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;




ALTER SCHEMA "public" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."EquipmentStatus" AS ENUM (
    'AVAILABLE',
    'IN_USE',
    'NEEDS_REPAIR',
    'DISCARDED'
);


ALTER TYPE "public"."EquipmentStatus" OWNER TO "postgres";


CREATE TYPE "public"."NotificationType" AS ENUM (
    'REQUEST_RECEIVED',
    'REQUEST_APPROVED',
    'REQUEST_REJECTED',
    'REQUEST_EXPIRING',
    'REQUEST_EXPIRED',
    'BORROW_STARTED',
    'RETURN_DUE_SOON',
    'RESOURCE_OVERDUE',
    'RESOURCE_RETURNED'
);


ALTER TYPE "public"."NotificationType" OWNER TO "postgres";


CREATE TYPE "public"."RequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'EXPIRED',
    'BORROWED',
    'RETURNED',
    'OVERDUE'
);


ALTER TYPE "public"."RequestStatus" OWNER TO "postgres";


CREATE TYPE "public"."Role" AS ENUM (
    'ADMIN',
    'DEPT_HEAD',
    'SUPER_ADMIN'
);


ALTER TYPE "public"."Role" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."AMRIInventory" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "assetCategory" "text",
    "itemDescription" "text",
    "quantityOrArea" "text",
    "functionalStatus" "text",
    "remarks" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."AMRIInventory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."AdaptiveResearchPosition" (
    "id" "text" NOT NULL,
    "attachedDepartment" "text",
    "postName" "text" NOT NULL,
    "bpsScale" "text" NOT NULL,
    "sanctionedPosts" integer NOT NULL,
    "filledPosts" integer NOT NULL,
    "vacantPosts" integer NOT NULL,
    "promotionPosts" integer NOT NULL,
    "initialRecruitmentPosts" integer NOT NULL,
    "remarks" "text",
    "orderNumber" integer,
    "departmentId" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."AdaptiveResearchPosition" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Agri_Engineering_Multan_Region_Data" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "category" "text",
    "divisionOrCity" "text",
    "officeName" "text",
    "quantityOrArea" "text",
    "contactDetails" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Agri_Engineering_Multan_Region_Data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."AgriculturalExtensionWing" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "location" "text" NOT NULL,
    "areaSquareFeet" integer,
    "remarks" "text",
    "status" "text" NOT NULL,
    "functionality" "text",
    "departmentId" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "equipmentStatus" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."AgriculturalExtensionWing" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."AgronomyLabEquipment" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "quantity" integer,
    "focalPerson1" "text",
    "displayOrder" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."AgronomyLabEquipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."CRIMultanAssets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "makeModel" "text",
    "labDepartment" "text",
    "purposeFunction" "text",
    "year" "text",
    "location" "text",
    "quantity" integer DEFAULT 1 NOT NULL,
    "operationalStatus" "text",
    "description" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."CRIMultanAssets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Department" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "location" "text" NOT NULL,
    "logo" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "description" "text",
    "designation" "text",
    "email" "text",
    "focalPerson" "text",
    "phone" "text",
    "secondaryEmail" "text"
);


ALTER TABLE "public"."Department" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ERSSStockRegister" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "quantityStr" "text",
    "dateReceived" timestamp(3) without time zone,
    "lastVerificationDate" "text",
    "currentStatusRemarks" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."ERSSStockRegister" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Equipment" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL,
    "purchaseDate" timestamp(3) without time zone NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Equipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."FloricultureStationAssets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "category" "text",
    "itemNameOrPost" "text",
    "bpsScale" "text",
    "sanctionedQty" integer,
    "inPositionQty" integer,
    "detailsOrArea" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."FloricultureStationAssets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."FoodAnalysisLabEquipment" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "labSectionName" "text",
    "roomNumber" "text",
    "quantity" integer DEFAULT 1 NOT NULL,
    "focalPerson" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."FoodAnalysisLabEquipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."MNSUAMEstateFacilities" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "blockName" "text",
    "facilityType" "text",
    "capacityPersons" integer,
    "capacityLabel" "text",
    "displayOrder" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."MNSUAMEstateFacilities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."MRIAssets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "category" "text",
    "itemNameOrDesignation" "text",
    "bpsScale" integer,
    "totalQuantityOrPosts" integer,
    "filledOrFunctional" integer,
    "vacantOrNonFunctional" integer,
    "remarksOrLocation" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."MRIAssets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."MaintenanceLog" (
    "id" "text" NOT NULL,
    "equipmentId" "text" NOT NULL,
    "date" timestamp(3) without time zone NOT NULL,
    "cost" numeric(10,2) NOT NULL,
    "description" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."MaintenanceLog" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Notification" (
    "id" "text" NOT NULL,
    "userId" "text" NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "requestId" "text",
    "read" boolean DEFAULT false NOT NULL,
    "emailSent" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."Notification" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."PageView" (
    "id" "text" NOT NULL,
    "page" "text" NOT NULL,
    "departmentId" "text",
    "userId" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."PageView" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."PesticideQCLabData" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "sectionCategory" "text",
    "bpsScale" integer,
    "quantityOrSanctioned" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."PesticideQCLabData" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."RAEDCEquipment" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "facilityType" "text",
    "capacity" integer,
    "location" "text",
    "functionality" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."RAEDCEquipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."RARIBahawalpurAssets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "category" "text",
    "makeModelYear" "text",
    "quantity" integer,
    "conditionStatus" "text",
    "useApplication" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."RARIBahawalpurAssets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."RequestAuditLog" (
    "id" "text" NOT NULL,
    "requestId" "text" NOT NULL,
    "action" "text" NOT NULL,
    "performedById" "text" NOT NULL,
    "previousStatus" "public"."RequestStatus",
    "newStatus" "public"."RequestStatus" NOT NULL,
    "notes" "text",
    "metadata" "jsonb",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."RequestAuditLog" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ResourceRequest" (
    "id" "text" NOT NULL,
    "resourceType" "text" NOT NULL,
    "resourceId" "text" NOT NULL,
    "resourceName" "text" NOT NULL,
    "requestingDeptId" "text" NOT NULL,
    "lendingDeptId" "text" NOT NULL,
    "requestedById" "text" NOT NULL,
    "requestReason" "text",
    "status" "public"."RequestStatus" DEFAULT 'PENDING'::"public"."RequestStatus" NOT NULL,
    "reviewedById" "text",
    "reviewedAt" timestamp(3) without time zone,
    "rejectionReason" "text",
    "borrowDurationDays" integer,
    "borrowStartDate" timestamp(3) without time zone,
    "borrowEndDate" timestamp(3) without time zone,
    "actualReturnDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."ResourceRequest" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SoilWaterTestingProject" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "category" "text",
    "bps" integer,
    "quantityRequired" integer,
    "budgetAllocationTotalMillion" numeric(10,3),
    "justificationOrYear" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."SoilWaterTestingProject" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "password" "text" NOT NULL,
    "role" "public"."Role" DEFAULT 'DEPT_HEAD'::"public"."Role" NOT NULL,
    "departmentId" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "image" "text"
);


ALTER TABLE "public"."User" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ValueAdditionLabEquipment" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "imageUrl" "text",
    "departmentId" "text" NOT NULL,
    "labName" "text",
    "roomNumber" "text",
    "blockName" "text",
    "quantity" integer DEFAULT 1 NOT NULL,
    "focalPerson" "text",
    "displayOrder" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "status" "public"."EquipmentStatus" DEFAULT 'AVAILABLE'::"public"."EquipmentStatus" NOT NULL
);


ALTER TABLE "public"."ValueAdditionLabEquipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."VisitorCounter" (
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "count" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."VisitorCounter" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ento_inventory_items" (
    "id" integer NOT NULL,
    "item_no" integer NOT NULL,
    "name" "text" NOT NULL,
    "quantity_label" "text",
    "date_received" "date",
    "last_verified" "date",
    "last_verification_label" "text",
    "register_label" "text",
    "source_line" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ento_inventory_items" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."ento_inventory_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."ento_inventory_items_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."ento_inventory_items_id_seq" OWNED BY "public"."ento_inventory_items"."id";



CREATE TABLE IF NOT EXISTS "public"."ento_profile" (
    "id" integer NOT NULL,
    "department_id" "text" NOT NULL,
    "department_name" "text" NOT NULL,
    "location" "text",
    "focal_person" "text",
    "designation" "text",
    "email" "text",
    "officers" integer,
    "officials" integer,
    "land_acres" numeric(10,2),
    "rooms" integer,
    "register_title" "text",
    "register_note" "text",
    "compiled_on" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ento_profile" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."ento_profile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."ento_profile_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."ento_profile_id_seq" OWNED BY "public"."ento_profile"."id";



ALTER TABLE ONLY "public"."ento_inventory_items" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ento_inventory_items_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ento_profile" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ento_profile_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."AMRIInventory"
    ADD CONSTRAINT "AMRIInventory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."AdaptiveResearchPosition"
    ADD CONSTRAINT "AdaptiveResearchPosition_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Agri_Engineering_Multan_Region_Data"
    ADD CONSTRAINT "Agri_Engineering_Multan_Region_Data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."AgriculturalExtensionWing"
    ADD CONSTRAINT "AgriculturalExtensionWing_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."AgronomyLabEquipment"
    ADD CONSTRAINT "AgronomyLabEquipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."CRIMultanAssets"
    ADD CONSTRAINT "CRIMultanAssets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Department"
    ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ERSSStockRegister"
    ADD CONSTRAINT "ERSSStockRegister_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Equipment"
    ADD CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."FloricultureStationAssets"
    ADD CONSTRAINT "FloricultureStationAssets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."FoodAnalysisLabEquipment"
    ADD CONSTRAINT "FoodAnalysisLabEquipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."MNSUAMEstateFacilities"
    ADD CONSTRAINT "MNSUAMEstateFacilities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."MRIAssets"
    ADD CONSTRAINT "MRIAssets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."MaintenanceLog"
    ADD CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."PageView"
    ADD CONSTRAINT "PageView_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."PesticideQCLabData"
    ADD CONSTRAINT "PesticideQCLabData_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."RAEDCEquipment"
    ADD CONSTRAINT "RAEDCEquipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."RARIBahawalpurAssets"
    ADD CONSTRAINT "RARIBahawalpurAssets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."RequestAuditLog"
    ADD CONSTRAINT "RequestAuditLog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ResourceRequest"
    ADD CONSTRAINT "ResourceRequest_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SoilWaterTestingProject"
    ADD CONSTRAINT "SoilWaterTestingProject_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ValueAdditionLabEquipment"
    ADD CONSTRAINT "ValueAdditionLabEquipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."VisitorCounter"
    ADD CONSTRAINT "VisitorCounter_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ento_inventory_items"
    ADD CONSTRAINT "ento_inventory_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ento_profile"
    ADD CONSTRAINT "ento_profile_department_id_key" UNIQUE ("department_id");



ALTER TABLE ONLY "public"."ento_profile"
    ADD CONSTRAINT "ento_profile_pkey" PRIMARY KEY ("id");



CREATE INDEX "AMRIInventory_departmentId_idx" ON "public"."AMRIInventory" USING "btree" ("departmentId");



CREATE INDEX "AMRIInventory_status_idx" ON "public"."AMRIInventory" USING "btree" ("status");



CREATE INDEX "AdaptiveResearchPosition_departmentId_idx" ON "public"."AdaptiveResearchPosition" USING "btree" ("departmentId");



CREATE INDEX "AdaptiveResearchPosition_orderNumber_idx" ON "public"."AdaptiveResearchPosition" USING "btree" ("orderNumber");



CREATE INDEX "Agri_Engineering_Multan_Region_Data_departmentId_idx" ON "public"."Agri_Engineering_Multan_Region_Data" USING "btree" ("departmentId");



CREATE INDEX "Agri_Engineering_Multan_Region_Data_status_idx" ON "public"."Agri_Engineering_Multan_Region_Data" USING "btree" ("status");



CREATE INDEX "AgriculturalExtensionWing_departmentId_idx" ON "public"."AgriculturalExtensionWing" USING "btree" ("departmentId");



CREATE INDEX "AgriculturalExtensionWing_equipmentStatus_idx" ON "public"."AgriculturalExtensionWing" USING "btree" ("equipmentStatus");



CREATE INDEX "AgronomyLabEquipment_departmentId_idx" ON "public"."AgronomyLabEquipment" USING "btree" ("departmentId");



CREATE INDEX "AgronomyLabEquipment_status_idx" ON "public"."AgronomyLabEquipment" USING "btree" ("status");



CREATE INDEX "CRIMultanAssets_departmentId_idx" ON "public"."CRIMultanAssets" USING "btree" ("departmentId");



CREATE INDEX "CRIMultanAssets_status_idx" ON "public"."CRIMultanAssets" USING "btree" ("status");



CREATE INDEX "CRIMultanAssets_type_idx" ON "public"."CRIMultanAssets" USING "btree" ("type");



CREATE INDEX "Department_name_idx" ON "public"."Department" USING "btree" ("name");



CREATE UNIQUE INDEX "Department_name_key" ON "public"."Department" USING "btree" ("name");



CREATE INDEX "ERSSStockRegister_departmentId_idx" ON "public"."ERSSStockRegister" USING "btree" ("departmentId");



CREATE INDEX "ERSSStockRegister_status_idx" ON "public"."ERSSStockRegister" USING "btree" ("status");



CREATE INDEX "Equipment_departmentId_idx" ON "public"."Equipment" USING "btree" ("departmentId");



CREATE INDEX "Equipment_status_idx" ON "public"."Equipment" USING "btree" ("status");



CREATE INDEX "Equipment_type_idx" ON "public"."Equipment" USING "btree" ("type");



CREATE INDEX "FloricultureStationAssets_departmentId_idx" ON "public"."FloricultureStationAssets" USING "btree" ("departmentId");



CREATE INDEX "FloricultureStationAssets_status_idx" ON "public"."FloricultureStationAssets" USING "btree" ("status");



CREATE INDEX "FoodAnalysisLabEquipment_departmentId_idx" ON "public"."FoodAnalysisLabEquipment" USING "btree" ("departmentId");



CREATE INDEX "FoodAnalysisLabEquipment_status_idx" ON "public"."FoodAnalysisLabEquipment" USING "btree" ("status");



CREATE INDEX "MNSUAMEstateFacilities_departmentId_idx" ON "public"."MNSUAMEstateFacilities" USING "btree" ("departmentId");



CREATE INDEX "MNSUAMEstateFacilities_status_idx" ON "public"."MNSUAMEstateFacilities" USING "btree" ("status");



CREATE INDEX "MRIAssets_departmentId_idx" ON "public"."MRIAssets" USING "btree" ("departmentId");



CREATE INDEX "MRIAssets_status_idx" ON "public"."MRIAssets" USING "btree" ("status");



CREATE INDEX "MaintenanceLog_date_idx" ON "public"."MaintenanceLog" USING "btree" ("date");



CREATE INDEX "MaintenanceLog_equipmentId_idx" ON "public"."MaintenanceLog" USING "btree" ("equipmentId");



CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification" USING "btree" ("createdAt");



CREATE INDEX "Notification_read_idx" ON "public"."Notification" USING "btree" ("read");



CREATE INDEX "Notification_userId_idx" ON "public"."Notification" USING "btree" ("userId");



CREATE INDEX "PageView_createdAt_idx" ON "public"."PageView" USING "btree" ("createdAt");



CREATE INDEX "PageView_departmentId_idx" ON "public"."PageView" USING "btree" ("departmentId");



CREATE INDEX "PageView_page_idx" ON "public"."PageView" USING "btree" ("page");



CREATE INDEX "PesticideQCLabData_departmentId_idx" ON "public"."PesticideQCLabData" USING "btree" ("departmentId");



CREATE INDEX "PesticideQCLabData_status_idx" ON "public"."PesticideQCLabData" USING "btree" ("status");



CREATE INDEX "RAEDCEquipment_departmentId_idx" ON "public"."RAEDCEquipment" USING "btree" ("departmentId");



CREATE INDEX "RAEDCEquipment_status_idx" ON "public"."RAEDCEquipment" USING "btree" ("status");



CREATE INDEX "RARIBahawalpurAssets_departmentId_idx" ON "public"."RARIBahawalpurAssets" USING "btree" ("departmentId");



CREATE INDEX "RARIBahawalpurAssets_status_idx" ON "public"."RARIBahawalpurAssets" USING "btree" ("status");



CREATE INDEX "RequestAuditLog_createdAt_idx" ON "public"."RequestAuditLog" USING "btree" ("createdAt");



CREATE INDEX "RequestAuditLog_performedById_idx" ON "public"."RequestAuditLog" USING "btree" ("performedById");



CREATE INDEX "RequestAuditLog_requestId_idx" ON "public"."RequestAuditLog" USING "btree" ("requestId");



CREATE INDEX "ResourceRequest_expiresAt_idx" ON "public"."ResourceRequest" USING "btree" ("expiresAt");



CREATE INDEX "ResourceRequest_lendingDeptId_idx" ON "public"."ResourceRequest" USING "btree" ("lendingDeptId");



CREATE INDEX "ResourceRequest_requestedById_idx" ON "public"."ResourceRequest" USING "btree" ("requestedById");



CREATE INDEX "ResourceRequest_requestingDeptId_idx" ON "public"."ResourceRequest" USING "btree" ("requestingDeptId");



CREATE INDEX "ResourceRequest_resourceType_resourceId_idx" ON "public"."ResourceRequest" USING "btree" ("resourceType", "resourceId");



CREATE INDEX "ResourceRequest_status_idx" ON "public"."ResourceRequest" USING "btree" ("status");



CREATE INDEX "SoilWaterTestingProject_departmentId_idx" ON "public"."SoilWaterTestingProject" USING "btree" ("departmentId");



CREATE INDEX "SoilWaterTestingProject_status_idx" ON "public"."SoilWaterTestingProject" USING "btree" ("status");



CREATE INDEX "User_departmentId_idx" ON "public"."User" USING "btree" ("departmentId");



CREATE INDEX "User_email_idx" ON "public"."User" USING "btree" ("email");



CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");



CREATE INDEX "ValueAdditionLabEquipment_departmentId_idx" ON "public"."ValueAdditionLabEquipment" USING "btree" ("departmentId");



CREATE INDEX "ValueAdditionLabEquipment_status_idx" ON "public"."ValueAdditionLabEquipment" USING "btree" ("status");



CREATE INDEX "ento_inventory_date_received_idx" ON "public"."ento_inventory_items" USING "btree" ("date_received");



CREATE INDEX "ento_inventory_item_no_idx" ON "public"."ento_inventory_items" USING "btree" ("item_no");



ALTER TABLE ONLY "public"."AMRIInventory"
    ADD CONSTRAINT "AMRIInventory_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."AdaptiveResearchPosition"
    ADD CONSTRAINT "AdaptiveResearchPosition_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Agri_Engineering_Multan_Region_Data"
    ADD CONSTRAINT "Agri_Engineering_Multan_Region_Data_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."AgriculturalExtensionWing"
    ADD CONSTRAINT "AgriculturalExtensionWing_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."AgronomyLabEquipment"
    ADD CONSTRAINT "AgronomyLabEquipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."CRIMultanAssets"
    ADD CONSTRAINT "CRIMultanAssets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ERSSStockRegister"
    ADD CONSTRAINT "ERSSStockRegister_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Equipment"
    ADD CONSTRAINT "Equipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."FloricultureStationAssets"
    ADD CONSTRAINT "FloricultureStationAssets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."FoodAnalysisLabEquipment"
    ADD CONSTRAINT "FoodAnalysisLabEquipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."MNSUAMEstateFacilities"
    ADD CONSTRAINT "MNSUAMEstateFacilities_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."MRIAssets"
    ADD CONSTRAINT "MRIAssets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."MaintenanceLog"
    ADD CONSTRAINT "MaintenanceLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Notification"
    ADD CONSTRAINT "Notification_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."ResourceRequest"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."PesticideQCLabData"
    ADD CONSTRAINT "PesticideQCLabData_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."RAEDCEquipment"
    ADD CONSTRAINT "RAEDCEquipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."RARIBahawalpurAssets"
    ADD CONSTRAINT "RARIBahawalpurAssets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."RequestAuditLog"
    ADD CONSTRAINT "RequestAuditLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."RequestAuditLog"
    ADD CONSTRAINT "RequestAuditLog_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."ResourceRequest"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ResourceRequest"
    ADD CONSTRAINT "ResourceRequest_lendingDeptId_fkey" FOREIGN KEY ("lendingDeptId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ResourceRequest"
    ADD CONSTRAINT "ResourceRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ResourceRequest"
    ADD CONSTRAINT "ResourceRequest_requestingDeptId_fkey" FOREIGN KEY ("requestingDeptId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ResourceRequest"
    ADD CONSTRAINT "ResourceRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."SoilWaterTestingProject"
    ADD CONSTRAINT "SoilWaterTestingProject_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ValueAdditionLabEquipment"
    ADD CONSTRAINT "ValueAdditionLabEquipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON UPDATE CASCADE ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;







































































































































































































