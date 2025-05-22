import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { Kysely } from 'kysely';
import { Database } from '@web-api/database-schema';

export const eligibleCasesQuery = ({
  db,
  trialCity,
}: {
  db: Kysely<Database>;
  trialCity: string;
}) => {
  return db
    .selectFrom('dwCase')
    .select('docketNumber')
    .where('preferredTrialCity', '=', trialCity)
    .where('status', '=', CASE_STATUS_TYPES.generalDocketReadyForTrial)
    .where('manuallyAddedToTrial', 'is not', true)
    .where('automaticBlocked', 'is not', true)
    .where('blocked', 'is not', true)
    .where(eb =>
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
    );
};

export const getEligibleCasesForTrialCity = async ({
  trialCity,
}: {
  trialCity: string;
}): Promise<Omit<RawCase, 'consolidatedCases'>[]> => {
  const ecDocketNumbers = await getDbReader(reader => {
    return eligibleCasesQuery({ db: reader, trialCity }).execute();
  });

  const docketNumbers = ecDocketNumbers.map(n => n.docketNumber);
  const fullEligibleCases = await getCasesByDocketNumbers({
    docketNumbers,
  });

  return fullEligibleCases || [];
};
