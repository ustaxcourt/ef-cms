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
    DECLARE
      old_text text;
      new_text text;
      old_array jsonb;
      new_array jsonb;
      array_changed boolean;
      text_changed boolean;
    BEGIN
      IF NEW.draft_order_state IS NOT NULL THEN
        old_text := OLD.draft_order_state ->> 'additionalOrderText';
        new_text := NEW.draft_order_state ->> 'additionalOrderText';
        old_array := OLD.draft_order_state -> 'additionalOrderTextArray';
        new_array := NEW.draft_order_state -> 'additionalOrderTextArray';

        array_changed := (new_array IS DISTINCT FROM old_array);
        text_changed  := (new_text  IS DISTINCT FROM old_text);

        IF array_changed AND NOT text_changed THEN
          -- array was updated: sync text from array
          IF new_array IS NOT NULL
            AND jsonb_typeof(new_array) = 'array'
            AND jsonb_array_length(new_array) > 0
          THEN
            NEW.draft_order_state := (NEW.draft_order_state - 'additionalOrderText')
              || jsonb_build_object('additionalOrderText', new_array ->> 0);
          ELSE
            NEW.draft_order_state := NEW.draft_order_state - 'additionalOrderText';
          END IF;
        ELSIF text_changed THEN
          -- text was updated (or both changed): sync array from text
          IF new_text IS NOT NULL THEN
            NEW.draft_order_state := (NEW.draft_order_state - 'additionalOrderTextArray')
              || jsonb_build_object(
                'additionalOrderTextArray',
                jsonb_build_array(new_text)
              );
          ELSE
            NEW.draft_order_state := NEW.draft_order_state - 'additionalOrderTextArray';
          END IF;
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
