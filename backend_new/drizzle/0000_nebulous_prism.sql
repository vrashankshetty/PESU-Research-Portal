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
	"role" text DEFAULT 'user' NOT NULL,
	"accessTo" text DEFAULT 'none' NOT NULL,
	"profileImg" text,
	"centre_name" text,
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
	"status" text,
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
	"status" text,
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
	"status" text,
	"patentNumber" text NOT NULL,
	"patentTitle" text NOT NULL,
	"isCapstone" boolean DEFAULT false,
	"year" text NOT NULL,
	"documentLink" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "departmentConductedActivity" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"nameOfProgram" text NOT NULL,
	"noOfParticipants" integer NOT NULL,
	"durationStartDate" timestamp NOT NULL,
	"durationEndDate" timestamp NOT NULL,
	"documentLink" text,
	"year" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "departmentAttendedActivity" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"programTitle" text NOT NULL,
	"durationStartDate" timestamp NOT NULL,
	"durationEndDate" timestamp NOT NULL,
	"documentLink" text,
	"year" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "studentSportsCultural" (
	"id" text PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"eventDate" timestamp NOT NULL,
	"eventName" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "studentCareerCounselling" (
	"id" text PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"activityName" text NOT NULL,
	"numberOfStudents" integer NOT NULL,
	"documentLink" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "studentEntranceExam" (
	"id" text PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"registrationNumber" text NOT NULL,
	"studentName" text NOT NULL,
	"isNET" boolean DEFAULT false,
	"isSLET" boolean DEFAULT false,
	"isGATE" boolean DEFAULT false,
	"isGMAT" boolean DEFAULT false,
	"isCAT" boolean DEFAULT false,
	"isGRE" boolean DEFAULT false,
	"isJAM" boolean DEFAULT false,
	"isIELTS" boolean DEFAULT false,
	"isTOEFL" boolean DEFAULT false,
	"documentLink" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "studentHigherStudies" (
	"id" text PRIMARY KEY NOT NULL,
	"studentName" text NOT NULL,
	"programGraduatedFrom" text NOT NULL,
	"institutionAdmittedTo" text NOT NULL,
	"programmeAdmittedTo" text NOT NULL,
	"documentLink" text,
	"year" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interSports" (
	"id" text PRIMARY KEY NOT NULL,
	"nameOfStudent" text NOT NULL,
	"nameOfEvent" text NOT NULL,
	"link" text NOT NULL,
	"nameOfUniv" text NOT NULL,
	"yearOfEvent" text NOT NULL,
	"teamOrIndi" text NOT NULL,
	"level" text NOT NULL,
	"nameOfAward" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "intraSports" (
	"id" text PRIMARY KEY NOT NULL,
	"event" text NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"link" text NOT NULL,
	"yearOfEvent" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "award" (
	"id" text PRIMARY KEY NOT NULL,
	"teacherAdminId" text NOT NULL,
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
	"teacherAdminId" text NOT NULL,
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
	"teacherAdminId" text NOT NULL,
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
	"teacherAdminId" text NOT NULL,
	"collaboratingAgency" text NOT NULL,
	"participantName" text NOT NULL,
	"yearOfCollaboration" text NOT NULL,
	"duration" text NOT NULL,
	"natureOfActivity" text NOT NULL,
	"documentLink" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "departmentConductedActivity" ADD CONSTRAINT "departmentConductedActivity_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "departmentAttendedActivity" ADD CONSTRAINT "departmentAttendedActivity_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "award" ADD CONSTRAINT "award_teacherAdminId_users_id_fk" FOREIGN KEY ("teacherAdminId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mou" ADD CONSTRAINT "mou_teacherAdminId_users_id_fk" FOREIGN KEY ("teacherAdminId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grant" ADD CONSTRAINT "grant_teacherAdminId_users_id_fk" FOREIGN KEY ("teacherAdminId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration" ADD CONSTRAINT "collaboration_teacherAdminId_users_id_fk" FOREIGN KEY ("teacherAdminId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
