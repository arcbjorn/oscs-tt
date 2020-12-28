import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  // LANGUAGES (1)

  await knex.raw(`
    CREATE TABLE "languages" (
      "id" SERIAL PRIMARY KEY,
      "code" VARCHAR(32) NOT NULL,
      "name" VARCHAR(256) NOT NULL
    );
  `);

  // USERS (2)

  await knex.raw(`
    CREATE TABLE "users" (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR(128) NOT NULL,
      "secret" VARCHAR(256),
      "name" VARCHAR(128) NOT NULL,
      "languageId" INTEGER
    );
    ALTER TABLE "users"
      ADD CONSTRAINT "users_languageid_foreign"
      FOREIGN KEY ("languageId") REFERENCES "languages" ("id");
  `);

  // TOPICS (3)

  await knex.raw(`
    CREATE TABLE "topics" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(128) NOT NULL,
      "description" VARCHAR(1024),
      "ownerId" INTEGER NOT NULL
    );
    ALTER TABLE "topics"
      ADD CONSTRAINT "topics_ownerid_foreign"
      FOREIGN KEY ("ownerId") REFERENCES "users" ("id")
      ON DELETE CASCADE;
  `);

  // SUBTOPICS (5)

  await knex.raw(`
    CREATE TABLE "subtopics" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(128) NOT NULL,
      "description" VARCHAR(1024),
      "ownerId" INTEGER NOT NULL,
      "topicId" INTEGER
    );
    ALTER TABLE "subtopics"
      ADD CONSTRAINT "subtopics_ownerid_foreign"
      FOREIGN KEY ("ownerId") REFERENCES "users" ("id")
      ON DELETE CASCADE;
    ALTER TABLE "subtopics"
      ADD CONSTRAINT "subtopics_topicid_foreign"
      FOREIGN KEY ("topicId") REFERENCES "topics" ("id")
      ON DELETE SET NULL;
  `);

  // SPECIALTIES (6)

  await knex.raw(`
    CREATE TABLE "specialties" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(128) NOT NULL,
      "description" VARCHAR(1024),
      "ownerId" INTEGER NOT NULL,
      "subtopicId" INTEGER
    );
    ALTER TABLE "specialties"
      ADD CONSTRAINT "specialties_ownerid_foreign"
      FOREIGN KEY ("ownerId") REFERENCES "users" ("id")
      ON DELETE CASCADE;
    ALTER TABLE "specialties"
      ADD CONSTRAINT "specialties_subtopicid_foreign"
      FOREIGN KEY ("subtopicId") REFERENCES "subtopics" ("id")
      ON DELETE SET NULL;
  `);

  // COURSES (7)

  await knex.raw(`
    CREATE TABLE "courses" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(128) NOT NULL,
      "description" VARCHAR(1024),
      "instructor" VARCHAR(128),
      "code" VARCHAR(128),
      "institution" VARCHAR(128),
      "ownerId" INTEGER NOT NULL,
      "subtopicId" INTEGER,
      "specialtyId" INTEGER
    );
    ALTER TABLE "courses"
      ADD CONSTRAINT "courses_ownerid_foreign"
      FOREIGN KEY ("ownerId") REFERENCES "users" ("id")
      ON DELETE CASCADE;
    ALTER TABLE "courses"
      ADD CONSTRAINT "courses_subtopicid_foreign"
      FOREIGN KEY ("subtopicId") REFERENCES "subtopics" ("id")
      ON DELETE SET NULL;
    ALTER TABLE "courses"
      ADD CONSTRAINT "courses_specialtyid_foreign"
      FOREIGN KEY ("specialtyId") REFERENCES "specialties" ("id")
      ON DELETE SET NULL;
  `);

  // SECTIONS (8)

  await knex.raw(`
    CREATE TABLE "sections" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(128) NOT NULL,
      "description" VARCHAR(1024),
      "ownerId" INTEGER NOT NULL,
      "courseId" INTEGER
    );
    ALTER TABLE "sections"
      ADD CONSTRAINT "sections_ownerid_foreign"
      FOREIGN KEY ("ownerId") REFERENCES "users" ("id")
      ON DELETE CASCADE;
    ALTER TABLE "sections"
      ADD CONSTRAINT "sections_courseid_foreign"
      FOREIGN KEY ("courseId") REFERENCES "courses" ("id")
      ON DELETE SET NULL;
  `);

  // TIME ENTRIES (9)

  await knex.raw(`
    CREATE TABLE "time_entries" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(128) NOT NULL,
      "description" VARCHAR(1024),
      "ownerId" INTEGER NOT NULL,
      "subtopicId" INTEGER,
      "courseId" INTEGER,
      "sectionId" INTEGER
    );
    ALTER TABLE "time_entries"
      ADD CONSTRAINT "time_entries_ownerid_foreign"
      FOREIGN KEY ("ownerId") REFERENCES "users" ("id")
      ON DELETE CASCADE;
    ALTER TABLE "time_entries"
      ADD CONSTRAINT "time_entries_subtopicid_foreign"
      FOREIGN KEY ("subtopicId") REFERENCES "subtopics" ("id")
      ON DELETE SET NULL;
    ALTER TABLE "time_entries"
      ADD CONSTRAINT "time_entries_courseid_foreign"
      FOREIGN KEY ("courseId") REFERENCES "courses" ("id")
      ON DELETE SET NULL;
    ALTER TABLE "time_entries"
      ADD CONSTRAINT "time_entries_sectionid_foreign"
      FOREIGN KEY ("sectionId") REFERENCES "sections" ("id")
      ON DELETE SET NULL;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS "time_entries";
    DROP TABLE IF EXISTS "sections";
    DROP TABLE IF EXISTS "courses";
    DROP TABLE IF EXISTS "specialties";
    DROP TABLE IF EXISTS "subtopics";
    DROP TABLE IF EXISTS "topics";
    DROP TABLE IF EXISTS "user_languages";
    DROP TABLE IF EXISTS "users";
    DROP TABLE IF EXISTS "languages";
  `);
}
