import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    UPDATE dw_case
    SET petitioners = (
      SELECT jsonb_agg(
        CASE
          WHEN elem ? 'paperPetitionEmail'
          THEN (elem - 'paperPetitionEmail') || jsonb_build_object('contactEmailAddress', elem->'paperPetitionEmail')
          ELSE elem
        END
      )
      FROM jsonb_array_elements(petitioners) AS elem
    )
    WHERE petitioners::text LIKE '%paperPetitionEmail%'
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    UPDATE dw_case
    SET petitioners = (
      SELECT jsonb_agg(
        CASE
          WHEN elem ? 'contactEmailAddress'
          THEN (elem - 'contactEmailAddress') || jsonb_build_object('paperPetitionEmail', elem->'contactEmailAddress')
          ELSE elem
        END
      )
      FROM jsonb_array_elements(petitioners) AS elem
    )
    WHERE petitioners::text LIKE '%contactEmailAddress%'
  `.execute(db);
}
