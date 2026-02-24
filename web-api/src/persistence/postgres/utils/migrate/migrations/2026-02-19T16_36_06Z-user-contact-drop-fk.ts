import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .alterTable('dwUserContact')
    .dropConstraint('dwUserContactUserFK')
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .alterTable('dwUserContact')
    .addForeignKeyConstraint('dwUserContactUserFK', ['userId'], 'dwUser', [
      'userId',
    ])
    .execute();
};
