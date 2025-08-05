import { pgInsertInto } from '../../utils/operation/pgInsertInto';

export const associateUsersWithCasesPending = async (
  pendingAssociations: {
    docketNumber: string;
    userId: string;
  }[],
) => {
  await pgInsertInto({
    table: 'dwUserOnCasePending',
    values: pendingAssociations,
  });
};
