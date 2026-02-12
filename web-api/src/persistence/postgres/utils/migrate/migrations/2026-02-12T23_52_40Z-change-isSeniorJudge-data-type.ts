import { Kysely, sql } from 'kysely';

// This migration uses postgres's cast operator (::) to convert strings to booleans.
// See https://www.postgresql.org/docs/current/datatype-boolean.html for additional
// information about postgres's boolean casting behavior.
export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TABLE "dw_user"
    ALTER COLUMN "is_senior_judge" TYPE boolean
    USING "is_senior_judge"::boolean
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TABLE "dw_user"
    ALTER COLUMN "is_senior_judge" TYPE varchar
    USING "is_senior_judge"::varchar
  `.execute(db);
}
