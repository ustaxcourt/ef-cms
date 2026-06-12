import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    UPDATE "dwDocketEntry"
    SET "draftOrderState" = ("draftOrderState" - 'additionalOrderText')
      || jsonb_build_object('additionalOrderTextArray',
        jsonb_build_array("draftOrderState" ->> 'additionalOrderText'))
    WHERE "draftOrderState" IS NOT NULL
      AND "draftOrderState" ? 'additionalOrderText'
      AND NOT ("draftOrderState" ? 'additionalOrderTextArray')
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    UPDATE "dwDocketEntry"
    SET "draftOrderState" = ("draftOrderState" - 'additionalOrderTextArray')
      || jsonb_build_object('additionalOrderText',
        "draftOrderState" -> 'additionalOrderTextArray' ->> 0)
    WHERE "draftOrderState" IS NOT NULL
      AND "draftOrderState" ? 'additionalOrderTextArray'
      AND NOT ("draftOrderState" ? 'additionalOrderText')
  `.execute(db);
}
