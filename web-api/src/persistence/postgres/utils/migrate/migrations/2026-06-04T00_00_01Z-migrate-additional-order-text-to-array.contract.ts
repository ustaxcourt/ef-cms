import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trg_sync_additional_order_text_fields ON dw_docket_entry;`.execute(
    db,
  );
  await sql`DROP FUNCTION IF EXISTS sync_additional_order_text_fields();`.execute(
    db,
  );

  // Remove the legacy additionalOrderText field now that all app colors use additionalOrderTextArray
  await sql`
    UPDATE dw_docket_entry
    SET draft_order_state = draft_order_state - 'additionalOrderText'
    WHERE draft_order_state IS NOT NULL
      AND draft_order_state ? 'additionalOrderText'
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Restore additionalOrderText from additionalOrderTextArray
  await sql`
    UPDATE dw_docket_entry
    SET draft_order_state = draft_order_state
      || jsonb_build_object(
        'additionalOrderText',
        draft_order_state -> 'additionalOrderTextArray' ->> 0
      )
    WHERE draft_order_state IS NOT NULL
      AND draft_order_state ? 'additionalOrderTextArray'
      AND jsonb_typeof(draft_order_state -> 'additionalOrderTextArray') = 'array'
      AND jsonb_array_length(draft_order_state -> 'additionalOrderTextArray') > 0
      AND NOT (draft_order_state ? 'additionalOrderText')
  `.execute(db);

  // Recreate trigger function
  await sql`
    CREATE OR REPLACE FUNCTION sync_additional_order_text_fields()
    RETURNS trigger
    AS $$
    BEGIN
      IF NEW.draft_order_state IS NOT NULL THEN
        IF NEW.draft_order_state ? 'additionalOrderTextArray'
          AND jsonb_typeof(NEW.draft_order_state -> 'additionalOrderTextArray') = 'array'
        THEN
          IF jsonb_array_length(NEW.draft_order_state -> 'additionalOrderTextArray') > 0 THEN
            NEW.draft_order_state := (NEW.draft_order_state - 'additionalOrderText')
              || jsonb_build_object(
                'additionalOrderText',
                NEW.draft_order_state -> 'additionalOrderTextArray' ->> 0
              );
          ELSE
            NEW.draft_order_state := NEW.draft_order_state - 'additionalOrderText';
          END IF;
        ELSIF NEW.draft_order_state ? 'additionalOrderText' THEN
          NEW.draft_order_state := (NEW.draft_order_state - 'additionalOrderTextArray')
            || jsonb_build_object(
              'additionalOrderTextArray',
              jsonb_build_array(NEW.draft_order_state ->> 'additionalOrderText')
            );
        END IF;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db);

  // Recreate trigger
  await sql`
    CREATE TRIGGER trg_sync_additional_order_text_fields
    BEFORE INSERT OR UPDATE OF draft_order_state
    ON dw_docket_entry
    FOR EACH ROW
    EXECUTE FUNCTION sync_additional_order_text_fields();
  `.execute(db);
}
