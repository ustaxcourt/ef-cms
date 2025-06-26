import { pgInsertInto } from '../../utils/operation/pgInsertInto';
import { toKyselyNewUserOnCaseRecords } from '../mapper';

export const upsertUserOnCaseRecords = async (
  userOnCaseRecords: Array<{
    userId: string;
    docketNumber: string;
    representing: string[];
  }>,
) => {
  await pgInsertInto({
    table: 'dwUserOnCase',
    values: toKyselyNewUserOnCaseRecords(userOnCaseRecords),
    onConflictColumns: ['docketNumber', 'userId'],
  });
};
