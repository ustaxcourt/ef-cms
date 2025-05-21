import { getDbReader } from '@web-api/database';
import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export const getEligibleCasesForTrialSession = async ({
  limit,
  trialCity,
  sessionType,
}: {
  limit: number;
  trialCity: string;
  sessionType: TrialSessionTypes;
}): Promise<Omit<RawCase, 'consolidatedCases'>[]> => {
  const ecDocketNumbers = await getDbReader(async reader => {
    let query = reader
      .selectFrom('dwCase')
      .select('docketNumber')
      .where('preferredTrialCity', '=', trialCity)
      .where('status', '=', CASE_STATUS_TYPES.generalDocketReadyForTrial)
      .where('manuallyAddedToTrial', 'is not', true)
      .where(eb =>
        eb.and([
          eb('automaticBlocked', 'is not', true),
          eb('blocked', 'is not', true),
          eb.not(
            eb.exists(sq =>
              sq
                .selectFrom('dwCase as c2')
                .select('c2.leadDocketNumber')
                .where('c2.preferredTrialCity', '=', trialCity)
                .whereRef('c2.leadDocketNumber', '=', 'dwCase.leadDocketNumber')
                .where(qb =>
                  qb.or([
                    qb('c2.automaticBlocked', '=', true),
                    qb('c2.blocked', '=', true),
                  ]),
                ),
            ),
          ),
        ]),
      )
      .limit(limit);

    if (sessionType !== SESSION_TYPES.hybrid) {
      query = query.where('procedureType', '=', sessionType);
    }
    return await query.execute();
  });

  const docketNumbers = ecDocketNumbers.map(n => n.docketNumber);
  const fullEligibleCases = await getCasesByDocketNumbers({
    docketNumbers,
  });

  return fullEligibleCases || [];
};
