import { Kysely } from 'kysely';

const TABLE_NAME = 'dwCaseDeadline';
const COLUMN_NAME = 'consolidatedCaseDeadlineId';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable(TABLE_NAME)
		.addColumn(COLUMN_NAME, 'varchar')
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable(TABLE_NAME).dropColumn(COLUMN_NAME).execute();
}
