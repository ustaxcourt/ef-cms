import { pgInsertInto } from '../../utils/operation/pgInsertInto';

export const upsertUserOnCasePendingRecords = async (
  userOnCaseRecords: Array<{
    userId: string;
    docketNumber: string;
  }>,
) => {
  await pgInsertInto({
    table: 'dwUserOnCasePending',
    values: userOnCaseRecords.map(userOnCaseRecord => {
      return {
        docketNumber: userOnCaseRecord.docketNumber,
        userId: userOnCaseRecord.userId,
      };
    }),
    onConflictColumns: ['docketNumber', 'userId'],
  });
};
