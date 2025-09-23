import {
  calculateDate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { pgUpdateTable } from '../utils/operation/pgUpdateTable';

export const removeCasesFromHearings = async ({
  trialSessionCases,
}: {
  trialSessionCases: {
    docketNumber: string;
    trialSessionId: string;
  }[];
}): Promise<void> => {
  await pgUpdateTable({
    table: 'dwTrialSessionCase',
    values: {
      removedFromTrial: true,
      removedFromTrialDate: calculateDate({
        dateString: createISODateString(),
      }),
    },
    where: qb =>
      qb.where(eb =>
        eb.or(
          trialSessionCases.map(pair =>
            eb.and([
              eb('trialSessionId', '=', pair.trialSessionId),
              eb('docketNumber', '=', pair.docketNumber),
            ]),
          ),
        ),
      ),
  });
};
