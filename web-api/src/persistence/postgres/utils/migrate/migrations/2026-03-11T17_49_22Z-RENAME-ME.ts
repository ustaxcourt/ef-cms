import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await console.log(db);
  // TODO
}

export async function down(db: Kysely<any>): Promise<void> {
  // TODO
  await console.log(db);
}
