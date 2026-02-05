import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('dwUserContact')
    .addColumn('userId', 'varchar', col => col.primaryKey())
    .addColumn('docketNumber', 'varchar')
    .addColumn('lat', 'decimal')
    .addColumn('lng', 'decimal')
    .addColumn('geodataMatch', 'boolean')
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
