import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/persistence/postgres/database';

type SuggestedCalendarCaseResult = {
  docketNumber: string;
  preferredTrialCity: string;
  procedureType: string;
  status: string;
};

export const getSuggestedCalendarCases = async () => {
  return await getDbReader(async reader => {
    const results = await reader
      .selectFrom('dwCase')
      .where('status', '=', CASE_STATUS_TYPES.generalDocketReadyForTrial)
      .where('preferredTrialCity', 'is not', null)
      .where('blocked', 'is not', true)
      .where('automaticBlocked', 'is not', true)
      .select(['procedureType', 'preferredTrialCity', 'docketNumber', 'status'])
      .limit(10000)
      .execute();

    return results as SuggestedCalendarCaseResult[];
  });
};
