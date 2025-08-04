import { calculateDate } from '@shared/business/utilities/DateHandler';
import { pgUpdateTable } from '../utils/operation/pgUpdateTable';

export const updateCaseTrialSession = async ({
  docketNumber,
  trialSessionId,
  calendarNotes,
  disposition,
  removedFromTrial,
  removedFromTrialDate,
}: {
  docketNumber: string;
  trialSessionId: string;
  calendarNotes?: string;
  disposition?: string;
  removedFromTrial?: boolean;
  removedFromTrialDate?: string;
}): Promise<void> => {

  await pgUpdateTable({
    table: 'dwTrialSessionCase',
    values:{
      calendarNotes,
      disposition,
      removedFromTrial,
      removedFromTrialDate: removedFromTrialDate
        ? calculateDate({ dateString:removedFromTrialDate })
        : undefined
    },
    where: cb =>
      cb
        .where('trialSessionId', '=', trialSessionId)
        .where('docketNumber', '=', docketNumber),
  });
};
