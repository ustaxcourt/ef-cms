import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const refreshUserConfirmationCodeExpiration = async ({
  confirmationCode,
  userId,
}: {
  userId: string;
  confirmationCode: string;
}): Promise<void> => {
  const expiresAt = calculateDate({
    dateString: formatNow(),
    howMuch: 1,
    units: 'days',
  });

  await pgUpdateTable({
    table: 'dwUserConfirmationCode',
    values: {
      ttl: Math.floor(expiresAt.getTime() / 1000),
    },
    where: cb =>
      cb
        .where('userId', '=', userId)
        .where('confirmationCode', '=', confirmationCode),
  });
};
