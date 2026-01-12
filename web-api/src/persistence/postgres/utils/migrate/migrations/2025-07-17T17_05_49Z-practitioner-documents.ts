import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwPractitionerDocuments')
    .addColumn('practitionerDocumentFileId', 'varchar', col => col.primaryKey())
    .addColumn('barNumber', 'varchar', col => col.notNull())
    .addColumn('categoryName', 'varchar')
    .addColumn('categoryType', 'varchar')
    .addColumn('description', 'varchar')
    .addColumn('fileName', 'varchar')
    .addColumn('location', 'varchar')
    .addColumn('uploadDate', 'timestamptz', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwPractitionerDocuments').execute();
}
