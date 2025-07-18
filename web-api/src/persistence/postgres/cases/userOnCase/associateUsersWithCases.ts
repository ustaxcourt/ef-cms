import { toKyselyNewUserOnCase } from '@web-api/persistence/postgres/cases/userOnCase/mapper';
import { pgInsertInto } from '../../utils/operation/pgInsertInto';
import { UserOnCaseAssociation } from '@web-api/persistence/postgres/cases/userOnCase/schema';

export const associateUsersWithCases = async (
  userOnCaseRecords: Array<UserOnCaseAssociation>,
) => {
  if (!userOnCaseRecords.length) {
    return;
  }

  await pgInsertInto({
    table: 'dwUserOnCase',
    values: userOnCaseRecords.map(toKyselyNewUserOnCase),
    onConflictColumns: ['docketNumber', 'userId'],
  });
};
