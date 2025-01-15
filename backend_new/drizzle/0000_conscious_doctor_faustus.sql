DO $$ BEGIN
 CREATE TYPE "qNo" AS ENUM('Q1', 'Q2', 'Q3', 'Q4', 'NA');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "campus" AS ENUM('EC', 'RR', 'HSN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "coreEnum" AS ENUM('coreA', 'coreB', 'coreC', 'scopus', 'NA');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "dept" AS ENUM('EC', 'CSE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"empId" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"phno" text NOT NULL,
	"dept" text NOT NULL,
	"campus" text NOT NULL,
	"panNo" text NOT NULL,
	"qualification" text NOT NULL,
	"designation" text NOT NULL,
	"expertise" text NOT NULL,
	"dateofJoining" date NOT NULL,
	"totalExpBfrJoin" text NOT NULL,
	"googleScholarId" text NOT NULL,
	"sId" text NOT NULL,
	"oId" text NOT NULL,
	"profileImg" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_empId_unique" UNIQUE("empId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"teacherAdminId" text NOT NULL,
	"campus" text NOT NULL,
	"dept" text NOT NULL,
	"journalName" text NOT NULL,
	"month" text NOT NULL,
	"year" text NOT NULL,
	"volumeNo" text NOT NULL,
	"issueNo" text NOT NULL,
	"issn" text NOT NULL,
	"websiteLink" text,
	"articleLink" text,
	"isUGC" boolean DEFAULT false,
	"isScopus" boolean DEFAULT false,
	"isWOS" boolean DEFAULT false,
	"qNo" text DEFAULT 'NA' NOT NULL,
	"impactFactor" text,
	"isCapstone" boolean DEFAULT false,
	"isAffiliating" boolean DEFAULT false,
	"pageNumber" integer DEFAULT 0,
	"abstract" text NOT NULL,
	"keywords" text[],
	"domain" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conference" (
	"id" text PRIMARY KEY NOT NULL,
	"teacherAdminId" text NOT NULL,
	"totalAuthors" integer DEFAULT 0,
	"campus" text NOT NULL,
	"dept" text NOT NULL,
	"bookTitle" text NOT NULL,
	"paperTitle" text NOT NULL,
	"proceedings_conference_title" text NOT NULL,
	"volumeNo" text NOT NULL,
	"issueNo" text NOT NULL,
	"year" text NOT NULL,
	"pageNumber" integer DEFAULT 0,
	"issn" text NOT NULL,
	"is_affiliating_institution_same" boolean DEFAULT false,
	"publisherName" text NOT NULL,
	"impactFactor" text NOT NULL,
	"core" text DEFAULT 'NA' NOT NULL,
	"link_of_paper" text NOT NULL,
	"isCapstone" boolean DEFAULT false,
	"abstract" text NOT NULL,
	"keywords" text[],
	"domain" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journalUser" (
	"id" text PRIMARY KEY NOT NULL,
	"journalId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patentUser" (
	"id" text PRIMARY KEY NOT NULL,
	"patentId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conferenceUser" (
	"id" text PRIMARY KEY NOT NULL,
	"conferenceId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patent" (
	"id" text PRIMARY KEY NOT NULL,
	"teacherAdminId" text NOT NULL,
	"campus" text NOT NULL,
	"dept" text NOT NULL,
	"patentNumber" text NOT NULL,
	"patentTitle" text NOT NULL,
	"isCapstone" boolean DEFAULT false,
	"year" text NOT NULL,
	"documentLink" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal" ADD CONSTRAINT "journal_teacherAdminId_users_id_fk" FOREIGN KEY ("teacherAdminId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conference" ADD CONSTRAINT "conference_teacherAdminId_users_id_fk" FOREIGN KEY ("teacherAdminId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journalUser" ADD CONSTRAINT "journalUser_journalId_journal_id_fk" FOREIGN KEY ("journalId") REFERENCES "journal"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journalUser" ADD CONSTRAINT "journalUser_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patentUser" ADD CONSTRAINT "patentUser_patentId_patent_id_fk" FOREIGN KEY ("patentId") REFERENCES "patent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patentUser" ADD CONSTRAINT "patentUser_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conferenceUser" ADD CONSTRAINT "conferenceUser_conferenceId_conference_id_fk" FOREIGN KEY ("conferenceId") REFERENCES "conference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conferenceUser" ADD CONSTRAINT "conferenceUser_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patent" ADD CONSTRAINT "patent_teacherAdminId_users_id_fk" FOREIGN KEY ("teacherAdminId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
