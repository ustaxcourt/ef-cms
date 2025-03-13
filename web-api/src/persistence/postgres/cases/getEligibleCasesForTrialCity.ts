import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { RawEligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { convertDbRowToRawEligibleCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { query } from '@web-api/persistence/dynamodbClientService';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

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
          eb.or([
            eb('automaticBlocked', '=', false),
            eb('automaticBlocked', 'is', null),
          ]),
          eb.or([eb('blocked', '=', false), eb('blocked', 'is', null)]),
          // eb.or([
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
          // ]),
        ]),
      )
      .execute(),
  );

  // use batchGet instead of queries with Promise.all?
  const casePromises = dbCases.map(async c => {
    const [privatePractitioners, irsPractitioners] = await Promise.all([
      query({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${c.docketNumber}`,
          ':skPrefix': 'privatePractitioner|',
        },
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :skPrefix)',
        applicationContext,
      }),
      query({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${c.docketNumber}`,
          ':skPrefix': 'irsPractitioner|',
        },
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :skPrefix)',
        applicationContext,
      }),
    ]);

    return purgeDynamoKeys({
      ...c,
      irsPractitioners,
      privatePractitioners,
    });
  });

  const fullEligibleCases = await Promise.all(casePromises);

  const casesForReturn = fullEligibleCases.map(c => {
    return c
      ? transformNullToUndefined(convertDbRowToRawEligibleCase(c))
      : undefined;
  });

  return casesForReturn || [];
};
