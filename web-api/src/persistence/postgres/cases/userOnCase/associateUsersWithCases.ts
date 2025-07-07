import { toKyselyNewUserOnCase } from '@web-api/persistence/postgres/cases/userOnCase/mapper';
import { pgInsertInto } from '../../utils/operation/pgInsertInto';

export const upsertUserOnCaseRecords = async (
  userOnCaseRecords: Array<{
    userId: string;
    docketNumber: string;
    representing?: string[];
    serviceIndicator?: string;
  }>,
) => {
  await pgInsertInto({
    table: 'dwUserOnCase',
    values: userOnCaseRecords.map(toKyselyNewUserOnCase),
    onConflictColumns: ['docketNumber', 'userId'],
  });
};
