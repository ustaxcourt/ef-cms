import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { RawEligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';

export const getEligibleCasesForTrialCity = async ({
  applicationContext,
  trialCity,
}: {
  trialCity: string;
  applicationContext: ServerApplicationContext;
}): Promise<RawEligibleCase[]> => {
  const dbCases = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select([
        'caption',
        'caseType',
        'docketNumber',
        'docketNumberSuffix',
        'leadDocketNumber',
        'procedureType',
        'highPriority',
        'qcCompleteForTrial',
        'isSealed',
      ])
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
      .execute(),
  );

  // use batchGet instead of queries with Promise.all?
  const casePromises = dbCases.map(async c => {
    const [privatePractitioners, irsPractitioners] = await Promise.all([
      getPrivatePractitionersOnCase({
        docketNumber: c.docketNumber,
        applicationContext,
      }),
      getIrsPractitionersOnCase({
        docketNumber: c.docketNumber,
        applicationContext,
      }),
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
    return { ...c, ...dynamoData };
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
      };
    });

  return casesForReturn || [];
};
