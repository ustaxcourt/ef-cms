import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    UPDATE dw_case
    SET petitioners = (
      SELECT jsonb_agg(
        CASE
          WHEN elem ? 'paperPetitionEmail' AND NOT elem ? 'contactEmailAddress'
          THEN elem || jsonb_build_object('contactEmailAddress', elem->'paperPetitionEmail')
          ELSE elem
        END
      )
      FROM jsonb_array_elements(petitioners) AS elem
    )
    WHERE petitioners::text LIKE '%paperPetitionEmail%'
  `.execute(db);

  await sql`
    CREATE OR REPLACE FUNCTION sync_petitioner_email_fields()
    RETURNS trigger
    AS $$
    BEGIN
      IF NEW.petitioners IS NOT NULL THEN
        NEW.petitioners := (
          SELECT jsonb_agg(
            CASE
              WHEN elem ? 'paperPetitionEmail' AND NOT elem ? 'contactEmailAddress'
                THEN elem || jsonb_build_object('contactEmailAddress', elem->'paperPetitionEmail')
              WHEN elem ? 'contactEmailAddress' AND NOT elem ? 'paperPetitionEmail'
                THEN elem || jsonb_build_object('paperPetitionEmail', elem->'contactEmailAddress')
              ELSE elem
            END
          )
          FROM jsonb_array_elements(NEW.petitioners) AS elem
        );
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `.execute(db);

  await sql`
    DROP TRIGGER IF EXISTS trg_sync_petitioner_email_fields ON dw_case;
    CREATE TRIGGER trg_sync_petitioner_email_fields
    BEFORE INSERT OR UPDATE OF petitioners
    ON dw_case
    FOR EACH ROW
    EXECUTE FUNCTION sync_petitioner_email_fields()
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP TRIGGER IF EXISTS trg_sync_petitioner_email_fields ON dw_case;
  `.execute(db);

  await sql`
    DROP FUNCTION IF EXISTS sync_petitioner_email_fields();
  `.execute(db);

  await sql`
    UPDATE dw_case
    SET petitioners = (
      SELECT jsonb_agg(elem - 'contactEmailAddress')
      FROM jsonb_array_elements(petitioners) AS elem
    )
    WHERE petitioners::text LIKE '%contactEmailAddress%'
  `.execute(db);
}
