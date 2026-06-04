import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    UPDATE dw_docket_entry
    SET draft_order_state = (draft_order_state - 'additionalOrderText')
      || jsonb_build_object('additionalOrderTextArray',
        jsonb_build_array(draft_order_state ->> 'additionalOrderText'))
    WHERE draft_order_state IS NOT NULL
      AND draft_order_state ? 'additionalOrderText'
      AND NOT (draft_order_state ? 'additionalOrderTextArray')
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    UPDATE dw_docket_entry
    SET draft_order_state = (draft_order_state - 'additionalOrderTextArray')
      || jsonb_build_object('additionalOrderText',
        draft_order_state -> 'additionalOrderTextArray' ->> 0)
    WHERE draft_order_state IS NOT NULL
      AND draft_order_state ? 'additionalOrderTextArray'
      AND NOT (draft_order_state ? 'additionalOrderText')
  `.execute(db);
}
