import { getDbReader } from '@web-api/database';
import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { Case } from '@shared/business/entities/cases/Case';
import { getPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/getPetitionersOnCase';
import { getCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/getCaseStatistics';

export const getFullEligibleCasesForTrialSession = async ({
  applicationContext,
  limit,
  trialCity,
  sessionType,
}: {
  applicationContext: ServerApplicationContext;
  limit: number;
  trialCity: string;
  sessionType: TrialSessionTypes;
}): Promise<
  Omit<
    RawCase,
    'correspondence' | 'consolidatedCases' | 'docketEntries' | 'hearings'
  >[]
> => {
  const dbCases = await getDbReader(async reader => {
    let query = reader
      .selectFrom('dwCase')
      .selectAll()
      .where('preferredTrialCity', '=', trialCity)
      .where('status', '=', CASE_STATUS_TYPES.generalDocketReadyForTrial)
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

  const casePromises = dbCases.map(async c => {
    const [
      privatePractitioners,
      irsPractitioners,
      petitioners,
      caseStatistics,
    ] = await Promise.all([
      getPrivatePractitionersOnCase({
        docketNumber: c.docketNumber,
        applicationContext,
      }),
      getIrsPractitionersOnCase({
        docketNumber: c.docketNumber,
        applicationContext,
      }),
      getPetitionersOnCase({ docketNumber: c.docketNumber }),
      getCaseStatistics({ docketNumber: c.docketNumber }),
    ]);

    const dynamoData = purgeDynamoKeys<
      any,
      {
        irsPractitioners: IrsPractitioner[];
        privatePractitioners: PrivatePractitioner[];
      }
    >({
      ...c,
      irsPractitioners,
      privatePractitioners,
    });
    return { ...c, ...dynamoData, petitioners, statistics: caseStatistics };
  });

  const fullEligibleCases = await Promise.all(casePromises);

  const casesForReturn = fullEligibleCases
    .filter(c => c)
    .map(c => {
      return {
        ...fromKyselyCase(c),
        isSealed: !!c.isSealed,
        irsPractitioners: c.irsPractitioners,
        privatePractitioners: c.privatePractitioners,
        docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
          docketNumber: c.docketNumber,
          docketNumberSuffix: c.docketNumberSuffix,
        }),
      };
    });

  return casesForReturn || [];
};
