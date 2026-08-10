import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .addColumn('petitionPaymentTransactionReferenceId', 'varchar')
    .addColumn('petitionPaymentToken', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .dropColumn('petitionPaymentTransactionReferenceId')
    .dropColumn('petitionPaymentToken')
    .execute();
}
