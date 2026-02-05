import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('dwUserContact')
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addColumn('lat', 'decimal')
    .addColumn('lng', 'decimal')
    .addPrimaryKeyConstraint('pkUserContact', ['userId', 'docketNumber'])
    .addForeignKeyConstraint(
      'dwUserContactUserFK',
      ['userId'],
      'dwUser',
      ['userId'],
    )
    .addForeignKeyConstraint(
      'dwUserContactDocketFK',
      ['docketNumber'],
      'dwCase',
      ['docketNumber'],
    )
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('dwUserContact').execute();
};
