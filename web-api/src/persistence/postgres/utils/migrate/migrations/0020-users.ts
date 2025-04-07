import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwUser')
    .addColumn('userId', 'varchar', col => col.primaryKey())
    .addColumn('additionalPhone', 'varchar')
    .addColumn('address1', 'varchar')
    .addColumn('address2', 'varchar')
    .addColumn('address3', 'varchar')
    .addColumn('admissionsDate', 'timestamptz')
    .addColumn('admissionsStatus', 'varchar')
    .addColumn('barNumber', 'varchar')
    .addColumn('birthYear', 'int2')
    .addColumn('city', 'varchar')
    .addColumn('confirmEmail', 'varchar')
    .addColumn('country', 'varchar')
    .addColumn('countryType', 'varchar')
    .addColumn('email', 'varchar')
    .addColumn('firmName', 'varchar')
    .addColumn('firstName', 'varchar')
    .addColumn('isSeniorJudge', 'boolean')
    .addColumn('isUpdatingInformation', 'boolean')
    .addColumn('judgeFullName', 'varchar')
    .addColumn('judgePhoneNumber', 'varchar')
    .addColumn('judgeTitle', 'varchar')
    .addColumn('lastName', 'varchar')
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('middleName', 'varchar')
    .addColumn('originalBarState', 'varchar')
    .addColumn('pendingEmail', 'varchar')
    .addColumn('pendingEmailVerificationToken', 'varchar')
    .addColumn('pendingEmailVerificationTokenTimestamp', 'timestamptz')
    .addColumn('phone', 'varchar')
    .addColumn('postalCode', 'varchar')
    .addColumn('practiceType', 'varchar')
    .addColumn('practitionerNotes', 'text')
    .addColumn('practitionerType', 'varchar')
    .addColumn('representing', 'jsonb')
    .addColumn('role', 'varchar', col => col.notNull())
    .addColumn('section', 'varchar')
    .addColumn('serviceIndicator', 'varchar')
    .addColumn('state', 'varchar')
    .addColumn('suffix', 'varchar')
    .addColumn('token', 'varchar')
    .addColumn('updatedEmail', 'varchar')
    .addColumn('userType', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwUser').execute();
}
