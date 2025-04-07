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
  const confirmationCode = await pgInsertInto({
    table: 'dwUserConfirmationCode',
    values: {
      id: getUniqueId(),
      userId,
      confirmationCode: getUniqueId(),
      expiresAt: calculateDate({
        dateString: formatNow(),
        howMuch: 1,
        units: 'days',
      }),
    },
  })[0];

  return {
    confirmationCode,
  };
};
