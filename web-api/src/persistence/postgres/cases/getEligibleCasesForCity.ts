// import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { RawEligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { ServerApplicationContext } from '@web-api/applicationContext';
// import { convertDbRowToRawEligibleCase } from '@web-api/persistence/postgres/cases/mapper';
// import { getDbReader } from '@web-api/database';
// import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
// import { query } from '@web-api/persistence/dynamodbClientService';
// import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import mockEligibleCases from '@shared/test/tempEligibleCases.json';

export const getEligibleCasesForCity = async ({
  applicationContext,
  trialCity,
}: {
  trialCity: string;
  applicationContext: ServerApplicationContext;
}): Promise<RawEligibleCase[] | undefined> => {
  // const dbCases = await getDbReader(reader =>
  //   reader
  //     .selectFrom('dwCase')
  //     .select([
  //       'caption',
  //       'caseType',
  //       'docketNumber',
  //       'docketNumberSuffix',
  //       'docketNumberWithSuffix',
  //       'leadDocketNumber',
  //       'highPriority',
  //       'qcCompleteForTrial',
  //       'isSealed',
  //     ])
  //     .where('preferredTrialCity', '=', trialCity)
  //     // .where('status', '=', CASE_STATUS_TYPES.generalDocketReadyForTrial)
  //     // .where('blocked', '!=', true)
  //     // .where('automaticBlocked', '!=', true)
  //     .execute(),
  // );
  //
  // // use batchGet instead of queries with Promise.all?
  // const casePromises = dbCases.map(async c => {
  //   const [privatePractitioners, irsPractitioners] = await Promise.all([
  //     query({
  //       ExpressionAttributeNames: {
  //         '#pk': 'pk',
  //         '#sk': 'sk',
  //       },
  //       ExpressionAttributeValues: {
  //         ':pk': `case|${c.docketNumber}`,
  //         ':skPrefix': 'privatePractitioner|',
  //       },
  //       KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :skPrefix)',
  //       applicationContext,
  //     }),
  //     query({
  //       ExpressionAttributeNames: {
  //         '#pk': 'pk',
  //         '#sk': 'sk',
  //       },
  //       ExpressionAttributeValues: {
  //         ':pk': `case|${c.docketNumber}`,
  //         ':skPrefix': 'irsPractitioner|',
  //       },
  //       KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :skPrefix)',
  //       applicationContext,
  //     }),
  //   ]);
  //
  //   return purgeDynamoKeys({
  //     ...c,
  //     irsPractitioners,
  //     privatePractitioners,
  //   });
  // });
  //
  // const fullEligibleCases = await Promise.all(casePromises);
  //
  // const casesForReturn = fullEligibleCases.map(c => {
  //   return c
  //     ? transformNullToUndefined(convertDbRowToRawEligibleCase(c))
  //     : undefined;
  // });
  //
  // return casesForReturn;
  const casesEligible = mockEligibleCases.map(c => {
    c.caseCaption = "This is a case caption";
    return c;
  });

  return casesEligible;
};
