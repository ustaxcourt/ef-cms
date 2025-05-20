import { getDbReader } from '@web-api/database';
import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
// import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
// import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { ServerApplicationContext } from '@web-api/applicationContext';
// import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
// import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
// import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
// import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
// import { Case } from '@shared/business/entities/cases/Case';
// import { RawEligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export const getEligibleCasesForTrialSession = async ({
  // applicationContext,
  limit,
  trialCity,
  sessionType,
}: {
  applicationContext: ServerApplicationContext;
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

  // const casePromises = dbCases.map(async c => {
  //   const [privatePractitioners, irsPractitioners] = await Promise.all([
  //     getPrivatePractitionersOnCase({
  //       docketNumber: c.docketNumber,
  //       applicationContext,
  //     }),
  //     getIrsPractitionersOnCase({
  //       docketNumber: c.docketNumber,
  //       applicationContext,
  //     }),
  //   ]);

  //   const dynamoData = purgeDynamoKeys<
  //     any,
  //     {
  //       irsPractitioners: IrsPractitioner[];
  //       privatePractitioners: PrivatePractitioner[];
  //     }
  //   >({
  //     ...c,
  //     irsPractitioners,
  //     privatePractitioners,
  //   });
  //   return { ...c, ...dynamoData };
  // });

  // const fullEligibleCases = await Promise.all(casePromises);

  const fullEligibleCases = await getCasesByDocketNumbers({
    docketNumbers: ecDocketNumbers.map(n => n.docketNumber),
  });

  // const casesForReturn = fullEligibleCases.map(c => {
  //   return {
  //     ...fromKyselyCase(c),
  //     isSealed: !!c.isSealed,
  //     irsPractitioners: c.irsPractitioners,
  //     privatePractitioners: c.privatePractitioners,
  //     docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
  //       docketNumber: c.docketNumber,
  //       docketNumberSuffix: c.docketNumberSuffix,
  //     }),
  //   };
  // });

  return fullEligibleCases || [];
};
