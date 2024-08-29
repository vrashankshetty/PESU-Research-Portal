DO $$ BEGIN
 CREATE TYPE "campus" AS ENUM('EC', 'RR', 'HSN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "dept" AS ENUM('EC', 'RR', 'HSN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal" (
	"id" text PRIMARY KEY NOT NULL,
	"serial_no" text NOT NULL,
	"title" text NOT NULL,
	"facultyNames" text[],
	"campus" "campus" NOT NULL,
	"dept" "dept" NOT NULL,
	"journalName" text NOT NULL,
	"month" text NOT NULL,
	"year" text NOT NULL,
	"volumeNo" text NOT NULL,
	"issueNo" text NOT NULL,
	"issn" text NOT NULL,
	"websiteLink" text,
	"articleLink" text,
	"isListed" boolean DEFAULT false,
	"abstract" text NOT NULL,
	"keywords" text[],
	"domainExpertise" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conference" (
	"id" text PRIMARY KEY NOT NULL,
	"serial_no" text NOT NULL,
	"teacherName" text NOT NULL,
	"coAuthors" text[],
	"totalAuthors" integer DEFAULT 0,
	"facultyNames" text[],
	"campus" "campus" NOT NULL,
	"dept" "dept" NOT NULL,
	"bookTitle" text NOT NULL,
	"paperTitle" text NOT NULL,
	"proceedings_conference_title" text NOT NULL,
	"volumeNo" text NOT NULL,
	"issueNo" text NOT NULL,
	"year" text NOT NULL,
	"issn" text NOT NULL,
	"is_affiliating_institution_same" boolean DEFAULT false,
	"publisherName" text NOT NULL,
	"impactFactor" text NOT NULL,
	"link_of_paper" text NOT NULL,
	"isCapstone" boolean DEFAULT false,
	"abstract" text NOT NULL,
	"keywords" text[],
	"domainExpertise" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patent" (
	"id" text PRIMARY KEY NOT NULL,
	"teacherName" text NOT NULL,
	"campus" "campus" NOT NULL,
	"dept" "dept" NOT NULL,
	"patentNumber" text NOT NULL,
	"patentTitle" text NOT NULL,
	"year" text NOT NULL,
	"documentLink" text NOT NULL
);
