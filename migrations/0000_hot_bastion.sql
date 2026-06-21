CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"passwordHash" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"vehicleId" text NOT NULL,
	"pickupLocation" text NOT NULL,
	"dropoffLocation" text NOT NULL,
	"pickupTime" timestamp NOT NULL,
	"dropoffTime" timestamp,
	"distance" numeric(10, 2),
	"fare" numeric(10, 2),
	"status" text DEFAULT 'pending' NOT NULL,
	"passengerName" text NOT NULL,
	"passengerPhone" text NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fare_rate" (
	"id" text PRIMARY KEY NOT NULL,
	"carType" text NOT NULL,
	"capacity" text NOT NULL,
	"ratePerKm" numeric(10, 2),
	"rateNonAc" numeric(10, 2),
	"rateAc" numeric(10, 2),
	"driverAllowance" integer DEFAULT 300 NOT NULL,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fare_rate_carType_unique" UNIQUE("carType")
);
--> statement-breakpoint
CREATE TABLE "fleet_car" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"capacity" text NOT NULL,
	"ratePerKm" numeric(10, 2) NOT NULL,
	"imageUrl" text NOT NULL,
	"rating" numeric(3, 1) DEFAULT '5.0' NOT NULL,
	"reviewCount" integer DEFAULT 0 NOT NULL,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "popular_route" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"label" text NOT NULL,
	"slug" text,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"bookingId" text NOT NULL,
	"userId" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"fromLocation" text NOT NULL,
	"toLocation" text NOT NULL,
	"distance" numeric(10, 2) NOT NULL,
	"estimatedTime" integer NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"capacity" integer NOT NULL,
	"pricePerKm" numeric(10, 2) NOT NULL,
	"baseFare" numeric(10, 2) NOT NULL,
	"image" text,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;