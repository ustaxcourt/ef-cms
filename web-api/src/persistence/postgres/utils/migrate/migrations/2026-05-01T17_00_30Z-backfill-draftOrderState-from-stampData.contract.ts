import { Kysely, sql } from 'kysely';

// Contract phase: drop the sync trigger added by the matching .expand
// migration. Run only after the new Grant/Deny Motion code is fully deployed
// and we are confident no stale frontend bundles are still writing stamp_data.

const TRANSLATE_STAMP_DATA_SQL_FRAGMENT = `
  jsonb_strip_nulls(jsonb_build_object(
    'disposition',              SOURCE->>'disposition',
    'deniedAsMoot',             (SOURCE->>'deniedAsMoot')::boolean,
    'deniedWithoutPrejudice',   (SOURCE->>'deniedWithoutPrejudice')::boolean,
    'strickenFromTrialSession', CASE
      WHEN COALESCE(SOURCE->>'strickenFromTrialSession', '') <> '' THEN true
      ELSE NULL
    END,
    'jurisdiction',             CASE
      WHEN SOURCE->>'jurisdictionalOption' = 'Jurisdiction is retained by the undersigned'
        THEN 'retained'
      WHEN SOURCE->>'jurisdictionalOption' = 'The case is restored to the general docket'
        THEN 'restoredToGeneralDocket'
      ELSE NULL
    END,
    'dueDateMessage',           CASE
      WHEN SOURCE->>'dueDateMessage' = 'The parties shall file a status report by'
        THEN 'statusReport'
      WHEN SOURCE->>'dueDateMessage' = 'The parties shall file a status report or proposed stipulated decision by'
        THEN 'statusReportOrStipulatedDecision'
      ELSE NULL
    END,
    'dueDate',                  CASE
      WHEN SOURCE->>'date' ~ '^[0-9]{2}/[0-9]{2}/[0-9]{2}$'
        THEN to_char(to_date(SOURCE->>'date', 'MM/DD/YY'), 'YYYY-MM-DD')
      ELSE NULL
    END,
    'additionalOrderText',      CASE
      WHEN COALESCE(SOURCE->>'customText', '') <> ''
        THEN jsonb_build_array(SOURCE->>'customText')
      ELSE jsonb_build_array('')
    END
  ))
`;

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    DROP TRIGGER IF EXISTS trg_sync_stamp_data_to_draft_order_state ON dw_docket_entry
  `.execute(db);

  await sql`
    DROP FUNCTION IF EXISTS sync_stamp_data_to_draft_order_state()
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Recreate the trigger (mirrors the body in the .expand migration).
  await sql.raw(`
    CREATE OR REPLACE FUNCTION sync_stamp_data_to_draft_order_state()
    RETURNS trigger AS $$
    BEGIN
      IF NEW.is_draft = true
         AND NEW.stamp_data IS NOT NULL
         AND NEW.stamp_data ? 'disposition'
         AND (NEW.draft_order_state IS NULL OR NEW.draft_order_state = '{}'::jsonb)
      THEN
        NEW.draft_order_state := ${TRANSLATE_STAMP_DATA_SQL_FRAGMENT.replace(/SOURCE/g, 'NEW.stamp_data')};
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `).execute(db);

  await sql`
    CREATE TRIGGER trg_sync_stamp_data_to_draft_order_state
    BEFORE INSERT OR UPDATE OF stamp_data
    ON dw_docket_entry
    FOR EACH ROW
    EXECUTE FUNCTION sync_stamp_data_to_draft_order_state()
  `.execute(db);
}
