import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwPetitionerOnCase')
    .addColumn('additionalName', 'varchar')
    .addColumn('contactType', 'varchar', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addColumn('hasConsentedToElectronicService', 'boolean')
    .addColumn('hasElectronicAccess', 'boolean')
    .addColumn('inCareOf', 'varchar')
    .addColumn('isAddressSealed', 'boolean', col => col.defaultTo(false))
    .addColumn('paperPetitionEmail', 'varchar')
    .addColumn('placeOfLegalResidence', 'varchar')
    .addColumn('sealedAndUnavailable', 'boolean')
    .addColumn('secondaryName', 'varchar')
    .addColumn('serviceIndicator', 'varchar')
    .addColumn('title', 'varchar')
    .addColumn('orderOnCase', 'smallint') // 0 for first petitioner on a case, 1 for second, etc.
    // Contact information
    .addColumn('address1', 'varchar', col => col.notNull())
    .addColumn('address2', 'varchar')
    .addColumn('address3', 'varchar')
    .addColumn('city', 'varchar', col => col.notNull())
    .addColumn('contactId', 'varchar')
    .addColumn('country', 'varchar')
    .addColumn('countryType', 'varchar', col => col.notNull())
    .addColumn('email', 'varchar')
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('phone', 'varchar', col => col.notNull())
    .addColumn('postalCode', 'varchar', col => col.notNull())
    .addColumn('state', 'varchar')
    .addPrimaryKeyConstraint('pkUserCaseMapping', ['docketNumber', 'contactId'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwPetitionerOnCase').execute();
}
