import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwUser')
    .addColumn('userId', 'varchar', col => col.primaryKey())
    .addColumn('pendingEmailVerificationToken', 'varchar')
    .addColumn('pendingEmailVerificationTokenTimestamp', 'timestamptz')
    .addColumn('email', 'varchar')
    .addColumn('name', 'varchar')
    .addColumn('pendingEmail', 'varchar')
    .addColumn('role', 'varchar')
    .addColumn('token', 'varchar')
    .addColumn('isUpdatingInformation', 'boolean')
    .addColumn('contact', 'jsonb')
    .addColumn('judgeFullName', 'varchar')
    .addColumn('judgeTitle', 'varchar')
    .addColumn('section', 'varchar')
    .addColumn('isSeniorJudge', 'varchar')
    .addColumn('judgePhoneNumber', 'varchar')
    .addColumn('additionalPhone', 'varchar')
    .addColumn('admissionsDate', 'timestamptz')
    .addColumn('admissionsStatus', 'varchar')
    .addColumn('barNumber', 'varchar')
    .addColumn('birthYear', 'int4')
    .addColumn('confirmEmail', 'varchar')
    .addColumn('practiceType', 'varchar')
    .addColumn('firmName', 'varchar')
    .addColumn('firstName', 'varchar')
    .addColumn('lastName', 'varchar')
    .addColumn('middleName', 'varchar')
    .addColumn('originalBarState', 'varchar')
    .addColumn('practitionerNotes', 'varchar')
    .addColumn('practitionerType', 'varchar')
    .addColumn('suffix', 'varchar')
    .addColumn('updatedEmail', 'varchar')
    .execute();

  // TODO: 10495: add indexs on columns

  await db.schema
    .createTable('dwUserOnCasePending')
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addPrimaryKeyConstraint('pkUserOnCasePending', ['docketNumber', 'userId'])
    .execute();

  await db.schema
    .createTable('dwUserOnCase')
    .addColumn('userId', 'varchar')
    .addColumn('docketNumber', 'varchar')
    .addColumn('representing', 'jsonb')
    .addColumn('serviceIndicator', 'varchar')
    .addPrimaryKeyConstraint('pk_user_on_case', ['userId', 'docketNumber'])
    .execute();

  await db.schema
    .createTable('dwUserConfirmationCode')
    .addColumn('userId', 'varchar', col => col.primaryKey())
    .addColumn('confirmationCode', 'varchar', col => col.notNull())
    .addColumn('ttl', 'bigint', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwUser').execute();
  await db.schema.dropTable('dwUserOnCase').execute();
  await db.schema.dropTable('dwUserConfirmationCode').execute();
  await db.schema.dropTable('dwUserOnCasePending').execute();
}
