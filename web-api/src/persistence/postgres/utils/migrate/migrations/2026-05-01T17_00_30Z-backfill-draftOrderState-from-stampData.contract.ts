import { Kysely, sql } from 'kysely';
import { buildDraftOrderStateFromStampDataSql } from '@web-api/persistence/postgres/utils/migrate/translateStampDataSql';

// Contract phase: drop the sync trigger added by the matching .expand
// migration. Run only after the new Grant/Deny Motion code is fully deployed
// and we are confident no stale frontend bundles are still writing stamp_data.

const DRAFT_ORDER_STATE_FROM_NEW_STAMP_SQL =
  buildDraftOrderStateFromStampDataSql('NEW.stamp_data', 'NEW');

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
  await sql
    .raw(
      `
    CREATE OR REPLACE FUNCTION sync_stamp_data_to_draft_order_state()
    RETURNS trigger AS $$
    BEGIN
      IF NEW.is_draft = true
         AND NEW.stamp_data IS NOT NULL
         AND NEW.stamp_data ? 'disposition'
         AND (NEW.draft_order_state IS NULL OR NEW.draft_order_state = '{}'::jsonb)
      THEN
        NEW.draft_order_state := ${DRAFT_ORDER_STATE_FROM_NEW_STAMP_SQL};
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `,
    )
    .execute(db);

  await sql`
    CREATE TRIGGER trg_sync_stamp_data_to_draft_order_state
    BEFORE INSERT OR UPDATE OF stamp_data
    ON dw_docket_entry
    FOR EACH ROW
    EXECUTE FUNCTION sync_stamp_data_to_draft_order_state()
  `.execute(db);
}
