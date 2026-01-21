import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .updateTable('dwDocketEntry')
    .set(eb => ({
      documentType: eb.ref('documentTypeUpdated'),
    }))
    .execute();
}

// export async function down(db: Kysely<any>): Promise<void> {
//   // Can't go back now
// }
