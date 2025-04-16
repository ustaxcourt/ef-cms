import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwUser')
    .addColumn('userId', 'varchar', col => col.primaryKey())
    .addColumn('address1', 'varchar')
    .addColumn('address2', 'varchar')
    .addColumn('address3', 'varchar')
    .addColumn('city', 'varchar')
    .addColumn('country', 'varchar')
    .addColumn('countryType', 'varchar')
    .addColumn('email', 'varchar')
    .addColumn('isSeniorJudge', 'boolean')
    .addColumn('isUpdatingInformation', 'boolean')
    .addColumn('judgeFullName', 'varchar')
    .addColumn('judgePhoneNumber', 'varchar')
    .addColumn('judgeTitle', 'varchar')
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('pendingEmail', 'varchar')
    .addColumn('pendingEmailVerificationToken', 'varchar')
    .addColumn('pendingEmailVerificationTokenTimestamp', 'timestamptz')
    .addColumn('phone', 'varchar')
    .addColumn('postalCode', 'varchar')
    .addColumn('role', 'varchar', col => col.notNull())
    .addColumn('section', 'varchar')
    .addColumn('state', 'varchar')
    .addColumn('token', 'varchar')
    .addColumn('userType', 'varchar')
    .execute();

  await db.schema
    .createTable('dwPractitioner')
    .addColumn('practitionerId', 'varchar', col => col.primaryKey())
    .addColumn('userId', 'varchar', col => col.unique()) // make this have to be unique, but also nullable
    .addColumn('additionalPhone', 'varchar')
    .addColumn('admissionsDate', 'timestamptz', col => col.notNull())
    .addColumn('admissionsStatus', 'varchar', col => col.notNull())
    .addColumn('barNumber', 'varchar', col => col.notNull())
    .addColumn('birthYear', 'int2', col => col.notNull())
    .addColumn('confirmEmail', 'varchar')
    .addColumn('firmName', 'varchar')
    .addColumn('firstName', 'varchar', col => col.notNull())
    .addColumn('lastName', 'varchar', col => col.notNull())
    .addColumn('middleName', 'varchar')
    .addColumn('originalBarState', 'varchar')
    .addColumn('practiceType', 'varchar', col => col.notNull())
    .addColumn('practitionerNotes', 'text')
    .addColumn('practitionerType', 'varchar', col => col.notNull())
    .addColumn('representing', 'jsonb')
    .addColumn('serviceIndicator', 'varchar', col => col.notNull())
    .addColumn('suffix', 'varchar')
    .addColumn('updatedEmail', 'varchar')
    .execute();

  await db.schema
    .createTable('dwUserConfirmationCode')
    .addColumn('id', 'varchar', col => col.primaryKey())
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('confirmationCode', 'varchar', col => col.notNull())
    .addColumn('expiresAt', 'timestamptz', col => col.notNull())
    .execute();

  await db.schema
    .createTable('dwUserOnCase')
    .addColumn('id', 'varchar', col => col.primaryKey())
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwUserOnCase').execute();
  await db.schema.dropTable('dwUserConfirmationCode').execute();
  await db.schema.dropTable('dwPractitioner').execute();
  await db.schema.dropTable('dwUser').execute();
}
