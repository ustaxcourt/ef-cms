import { getUniqueId } from '@shared/sharedAppContext';
import { pgInsertInto } from '../../utils/operation/pgInsertInto';

export const associateUserWithCase = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}) => {
  await pgInsertInto({
    table: 'dwUserOnCase',
    values: {
      id: getUniqueId(),
      userId,
      docketNumber,
    },
  });
};
