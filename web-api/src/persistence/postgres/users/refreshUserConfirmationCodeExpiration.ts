import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { pgUpdateTable } from '../utils/operation/pgUpdateTable';

export const refreshUserConfirmationCodeExpiration = async ({
  confirmationCode,
  userId,
}: {
  userId: string;
  confirmationCode: string;
}): Promise<void> => {
  await pgUpdateTable({
    table: 'dwUserConfirmationCode',
    values: {
      expiresAt: calculateDate({
        dateString: formatNow(),
        howMuch: 1,
        units: 'days',
      }),
    },
    where: cb =>
      cb
        .where('userId', '=', userId)
        .where('confirmationCode', '=', confirmationCode),
  });
};
