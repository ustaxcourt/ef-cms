import { getDbReader } from '@web-api/database';
import {
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { eligibleCasesQuery } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity';

export const getEligibleCasesForTrialSession = async ({
  limit,
  trialCity,
  sessionType,
}: {
  limit: number;
  trialCity: string;
  sessionType: TrialSessionTypes;
}): Promise<Omit<RawCase, 'consolidatedCases'>[]> => {
  const ecDocketNumbers = await getDbReader(reader => {
    let query = eligibleCasesQuery({ db: reader, trialCity });

    if (sessionType !== SESSION_TYPES.hybrid) {
      query = query.where('procedureType', '=', sessionType);
    }

    return query.select('docketNumber').limit(limit).execute();
  });

  const docketNumbers = ecDocketNumbers.map(n => n.docketNumber);
  const fullEligibleCases = await getCasesByDocketNumbers({
    docketNumbers,
  });

  return fullEligibleCases || [];
};
