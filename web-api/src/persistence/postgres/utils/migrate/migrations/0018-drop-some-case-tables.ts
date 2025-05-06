import { formatNow } from '@shared/business/utilities/DateHandler';
import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwPetitionerOnCase').execute();
  await db.schema.dropTable('dwCaseStatistic').execute();
  await db.schema.dropTable('dwStatisticPenalty').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
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
    .addColumn('phone', 'varchar')
    .addColumn('postalCode', 'varchar', col => col.notNull())
    .addColumn('state', 'varchar')
    .addPrimaryKeyConstraint('pkUserCaseMapping', ['docketNumber', 'contactId'])
    .execute();

  await db.schema
    .createTable('dwCaseStatistic')
    .addColumn('docketNumber', 'varchar')
    .addColumn('irsDeficiencyAmount', 'decimal')
    .addColumn('irsTotalPenalties', 'decimal')
    .addColumn('statisticId', 'varchar', col => col.primaryKey())
    .addColumn('year', 'smallint')
    .addColumn('yearOrPeriod', 'varchar')
    .addColumn('determinationTotalPenalties', 'decimal')
    .addColumn('determinationDeficiencyAmount', 'decimal')
    .addColumn('lastDateOfPeriod', 'timestamptz')
    .addColumn('updatedAt', 'timestamp', col =>
      col.notNull().defaultTo(formatNow()),
    )
    .execute();

  await db.schema
    .createTable('dwStatisticPenalty')
    .addColumn('statisticId', 'varchar')
    .addColumn('name', 'varchar')
    .addColumn('penaltyAmount', 'decimal')
    .addColumn('penaltyId', 'varchar', col => col.primaryKey())
    .addColumn('penaltyType', 'varchar')
    .addColumn('updatedAt', 'timestamp', col =>
      col.notNull().defaultTo(formatNow()),
    )
    .execute();
}
