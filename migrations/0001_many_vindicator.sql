CREATE TABLE "cab_booking" (
	"id" text PRIMARY KEY NOT NULL,
	"tripType" text DEFAULT 'outstation' NOT NULL,
	"journeyType" text DEFAULT 'one-way' NOT NULL,
	"fromCity" text NOT NULL,
	"toCity" text NOT NULL,
	"journeyDate" timestamp NOT NULL,
	"journeyTime" text NOT NULL,
	"returnDate" timestamp,
	"carType" text NOT NULL,
	"passengerName" text NOT NULL,
	"mobileNumber" text NOT NULL,
	"alternatePhone" text,
	"email" text,
	"estimatedFare" real,
	"status" text DEFAULT 'pending' NOT NULL,
	"adminNotes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_message" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visitor_log" (
	"id" text PRIMARY KEY NOT NULL,
	"ip_hash" text NOT NULL,
	"user_agent" text,
	"visited_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "reviews" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "routes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vehicles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "bookings" CASCADE;--> statement-breakpoint
DROP TABLE "reviews" CASCADE;--> statement-breakpoint
DROP TABLE "routes" CASCADE;--> statement-breakpoint
DROP TABLE "vehicles" CASCADE;--> statement-breakpoint
ALTER TABLE "fare_rate" ALTER COLUMN "ratePerKm" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fare_rate" ALTER COLUMN "rateNonAc" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fare_rate" ALTER COLUMN "rateAc" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fleet_car" ALTER COLUMN "ratePerKm" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fleet_car" ALTER COLUMN "rating" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fleet_car" ALTER COLUMN "rating" SET DEFAULT '4.5';