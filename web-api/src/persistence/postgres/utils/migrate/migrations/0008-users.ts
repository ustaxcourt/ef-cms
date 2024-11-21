import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwUser')
    .addColumn('address1', 'varchar', col => col.notNull())
    .addColumn('address2', 'varchar')
    .addColumn('address3', 'varchar')
    .addColumn('city', 'varchar', col => col.notNull())
    .addColumn('contactId', 'varchar', col => col.primaryKey())
    .addColumn('country', 'varchar')
    .addColumn('countryType', 'varchar', col => col.notNull())
    .addColumn('email', 'varchar')
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('phone', 'varchar', col => col.notNull())
    .addColumn('postalCode', 'varchar', col => col.notNull())
    .addColumn('state', 'varchar', col => col.notNull())
    .execute();

  await db.schema
    .createTable('dwUserCase')
    .addColumn('additionalName', 'varchar')
    .addColumn('contactId', 'varchar', col => col.notNull())
    .addColumn('contactType', 'varchar', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addColumn('hasConsentedToEService', 'boolean')
    .addColumn('hasEAccess', 'boolean')
    .addColumn('inCareOf', 'varchar')
    .addColumn('isAddressSealed', 'boolean', col => col.defaultTo(false)) // maybe?
    .addColumn('paperPetitionEmail', 'varchar')
    .addColumn('placeOfLegalResidence', 'varchar')
    .addColumn('sealedAndUnavailable', 'boolean')
    .addColumn('secondaryName', 'varchar')
    .addColumn('serviceIndicator', 'varchar')
    .addColumn('title', 'varchar')
    .addPrimaryKeyConstraint('pk_user_case_mapping', [
      'docketNumber',
      'contactId',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwUser').execute();
  await db.schema.dropTable('dwUserCase').execute();
}
