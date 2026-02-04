import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('dwUserContact')
    .addColumn('userId', 'varchar', col => col.primaryKey())
    .addColumn('docketNumber', 'varchar')
    .addColumn('address1', 'varchar', col => col.notNull())
    .addColumn('address2', 'varchar')
    .addColumn('address3', 'varchar')
    .addColumn('city', 'varchar', col => col.notNull())
    .addColumn('country', 'varchar')
    .addColumn('countryType', 'varchar', col => col.notNull())
    .addColumn('lat', 'decimal')
    .addColumn('lng', 'decimal')
    .addColumn('phone', 'varchar', col => col.notNull())
    .addColumn('postalCode', 'varchar', col => col.notNull())
    .addColumn('state', 'varchar')
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
