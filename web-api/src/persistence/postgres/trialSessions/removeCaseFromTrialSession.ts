import {
  calculateDate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { pgUpdateTable } from '../utils/operation/pgUpdateTable';

export const removeCaseFromTrialSession = async ({
  docketNumber,
  trialSessionId,
  disposition,
}: {
  docketNumber: string;
  trialSessionId: string;
  disposition: string;
}): Promise<void> => {
  await pgUpdateTable({
    table: 'dwTrialSessionCase',
    values: {
      removedFromTrial: true,
      removedFromTrialDate: calculateDate({
        dateString: createISODateString(),
      }),
      disposition,
    },
    where: qb =>
      qb
        .where('trialSessionId', '=', trialSessionId)
        .where('docketNumber', '=', docketNumber),
  });
};
