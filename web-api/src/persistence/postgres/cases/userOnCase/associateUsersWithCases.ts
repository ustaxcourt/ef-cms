import { toKyselyNewUserOnCase } from '@web-api/persistence/postgres/cases/userOnCase/mapper';
import { pgInsertInto } from '../../utils/operation/pgInsertInto';
import { Role } from '@shared/business/entities/EntityConstants';

export const associateUsersWithCases = async (
  userOnCaseRecords: Array<{
    userId: string;
    docketNumber: string;
    representing?: string[];
    serviceIndicator?: string;
    actingAsRole: Role;
  }>,
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
