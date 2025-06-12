CREATE TABLE IF NOT EXISTS "award" (
	"id" text PRIMARY KEY NOT NULL,
	"yearOfAward" text NOT NULL,
	"titleOfInnovation" text NOT NULL,
	"awardeeName" text NOT NULL,
	"awardingAgency" text NOT NULL,
	"category" text NOT NULL,
	"status" text,
	"documentLink" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mou" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationName" text NOT NULL,
	"yearOfSigning" text NOT NULL,
	"duration" text NOT NULL,
	"activities" text NOT NULL,
	"documentLink" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "grant" (
	"id" text PRIMARY KEY NOT NULL,
	"schemeName" text NOT NULL,
	"investigatorName" text NOT NULL,
	"fundingAgency" text NOT NULL,
	"type" text NOT NULL,
	"department" text NOT NULL,
	"yearOfAward" text NOT NULL,
	"fundsProvided" text NOT NULL,
	"duration" text NOT NULL,
	"documentLink" text,
	"status" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collaboration" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"collaboratingAgency" text NOT NULL,
	"participantName" text NOT NULL,
	"yearOfCollaboration" text NOT NULL,
	"duration" text NOT NULL,
	"natureOfActivity" text NOT NULL,
	"documentLink" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
