import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';

export const generateUserConfirmationCode = async ({
  userId,
}: {
  userId: string;
}): Promise<{ confirmationCode: string }> => {
  const expiresAt = calculateDate({
    dateString: formatNow(),
    howMuch: 1,
    units: 'days',
  });
  const confirmationCode = getUniqueId();
  await pgInsertInto({
    table: 'dwUserConfirmationCode',
    values: {
      userId,
      confirmationCode,
      ttl: Math.floor(expiresAt.getTime() / 1000),
    },
    onConflictColumns: ['userId'],
  });

  return {
    confirmationCode,
  };
};
