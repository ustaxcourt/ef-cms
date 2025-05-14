import { pgInsertInto } from '../../utils/operation/pgInsertInto';

export const associateUserWithCasePending = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}) => {
  await pgInsertInto({
    table: 'dwUserOnCasePending',
    values: {
      userId,
      docketNumber,
    },
  });
};
