import { Kysely, sql } from 'kysely';
import { buildDraftOrderStateFromStampDataSql } from '@web-api/persistence/postgres/utils/migrate/translateStampDataSql';

// Expand phase of the Apply Stamp -> Grant/Deny Motion data migration.
//
// 1) One-time backfill of `draft_order_state` for existing draft stamp orders
//    so they can hydrate the new Grant/Deny edit form.
// 2) Sync trigger that mirrors `stamp_data` into `draft_order_state` for any
//    rows written by an old (cached) frontend bundle during the blue/green
//    deploy window. The contract migration removes the trigger once we are
//    confident no stale bundles remain.
//
// Raw SQL is used (rather than Kysely's query builder) because we need
// JSONB-shape transforms with Postgres functions. Table and column names are
// the snake_case forms used in the database itself; the CamelCasePlugin used
// elsewhere in the codebase only applies to the typed query builder.
//
// Field mapping is mirrored in shared `translateStampDataToDraftOrderState`.

const DRAFT_ORDER_STATE_FROM_STAMP_SQL = buildDraftOrderStateFromStampDataSql(
  'stamp_data',
  'dw_docket_entry',
);

const DRAFT_ORDER_STATE_FROM_NEW_STAMP_SQL =
  buildDraftOrderStateFromStampDataSql('NEW.stamp_data', 'NEW');

export async function up(db: Kysely<any>): Promise<void> {
  // 1) Backfill existing rows. Only touch draft stamp orders that lack a
  //    populated draft_order_state so we never clobber data written by users.
  await sql
    .raw(
      `
    UPDATE dw_docket_entry
    SET draft_order_state = ${DRAFT_ORDER_STATE_FROM_STAMP_SQL}
    WHERE is_draft = true
      AND stamp_data IS NOT NULL
      AND stamp_data ? 'disposition'
      AND (draft_order_state IS NULL OR draft_order_state = '{}'::jsonb)
  `,
    )
    .execute(db);

  // 2) Trigger to keep new rows in sync during the deploy window.
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
    DROP TRIGGER IF EXISTS trg_sync_stamp_data_to_draft_order_state ON dw_docket_entry
  `.execute(db);

  await sql`
    CREATE TRIGGER trg_sync_stamp_data_to_draft_order_state
    BEFORE INSERT OR UPDATE OF stamp_data
    ON dw_docket_entry
    FOR EACH ROW
    EXECUTE FUNCTION sync_stamp_data_to_draft_order_state()
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP TRIGGER IF EXISTS trg_sync_stamp_data_to_draft_order_state ON dw_docket_entry
  `.execute(db);

  await sql`
    DROP FUNCTION IF EXISTS sync_stamp_data_to_draft_order_state()
  `.execute(db);

  // We deliberately do not roll back the backfilled draft_order_state values:
  // reverting them would risk clobbering newer state written by the new UI.
}
