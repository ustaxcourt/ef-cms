import { Kysely } from 'kysely';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

export async function up(db: Kysely<any>): Promise<void> {
  // dw User Table
  await db.schema
    .createTable('dwUser')
    .addColumn('userId', 'varchar', col => col.primaryKey())
    .addColumn('pendingEmailVerificationToken', 'varchar')
    .addColumn('pendingEmailVerificationTokenTimestamp', 'timestamptz')
    .addColumn('email', 'varchar')
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('pendingEmail', 'varchar')
    .addColumn('role', 'varchar', col => col.notNull())
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
    .addColumn('accountStatus', 'varchar', col => col.notNull())
    .execute();

  await db.schema
    .createIndex('idx_user_section')
    .on('dwUser')
    .column('section')
    .execute();

  await db.schema
    .createIndex('idx_user_bar_number')
    .on('dwUser')
    .column('barNumber')
    .execute();

  await db.schema
    .createIndex('idx_user_role')
    .on('dwUser')
    .column('role')
    .execute();

  await db.schema
    .createIndex('idx_user_name')
    .on('dwUser')
    .column('name')
    .execute();

  // dwUserOnCasePending Table
  await db.schema
    .createTable('dwUserOnCasePending')
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addPrimaryKeyConstraint('pkUserOnCasePending', ['docketNumber', 'userId'])
    .execute();

  // dwUserOnCase Table
  await db.schema
    .createTable('dwUserOnCase')
    .addColumn('userId', 'varchar')
    .addColumn('docketNumber', 'varchar')
    .addColumn('representing', 'jsonb')
    .addColumn('serviceIndicator', 'varchar')
    .addColumn('actingAsRole', 'varchar', col => col.notNull())
    .addPrimaryKeyConstraint('pk_user_on_case', ['userId', 'docketNumber'])
    .execute();

  await db.schema
    .createIndex('idx_user_on_case_docket_number')
    .on('dwUserOnCase')
    .column('docketNumber')
    .execute();

  // dwUserConfirmationCode Table
  await db.schema
    .createTable('dwUserConfirmationCode')
    .addColumn('userId', 'varchar', col => col.primaryKey())
    .addColumn('confirmationCode', 'varchar', col => col.notNull())
    .addColumn('ttl', 'bigint', col => col.notNull())
    .execute();

  await db.schema
    .createIndex('idx_confirmation_code_ttl')
    .on('dwUserConfirmationCode')
    .column('ttl')
    .execute();

  // dwBarNumber
  await db.schema
    .createTable('dwBarNumber')
    .addColumn('year', 'int8', col => col.primaryKey())
    .addColumn('lastUsedNumber', 'int8', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes in reverse order of creation
  await db.schema.dropIndex('idx_confirmation_code_ttl').execute();
  await db.schema.dropIndex('idx_user_on_case_docket_number').execute();
  await db.schema.dropIndex('idx_user_name').execute();
  await db.schema.dropIndex('idx_user_role').execute();
  await db.schema.dropIndex('idx_user_bar_number').execute();
  await db.schema.dropIndex('idx_user_section').execute();

  // Rename tables to preserve data instead of dropping them
  const timestamp = formatNow(FORMATS.ISO).replace(/[:.]/g, '-');
  await db.schema
    .alterTable('dwUserOnCasePending')
    .renameTo(`dwUserOnCasePending_rollback_${timestamp}`)
    .execute();
  await db.schema
    .alterTable('dwUserConfirmationCode')
    .renameTo(`dwUserConfirmationCode_rollback_${timestamp}`)
    .execute();
  await db.schema
    .alterTable('dwUserOnCase')
    .renameTo(`dwUserOnCase_rollback_${timestamp}`)
    .execute();
  await db.schema
    .alterTable('dwUser')
    .renameTo(`dwUser_rollback_${timestamp}`)
    .execute();
  await db.schema
    .alterTable('dwBarNumber')
    .renameTo(`dwBarNumber_rollback_${timestamp}`)
    .execute();
}
