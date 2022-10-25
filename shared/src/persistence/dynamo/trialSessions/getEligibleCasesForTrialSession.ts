import { batchGet, query } from '../../dynamodbClientService';

export const getEligibleCasesForTrialSession = async ({
  applicationContext,
  limit,
  skPrefix,
}: {
  applicationContext: IApplicationContext;
  limit: number;
  skPrefix: string;
}) => {
  const mappings = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': 'eligible-for-trial-case-catalog',
      ':prefix': skPrefix,
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    Limit: limit,
    applicationContext,
  });

  let docketNumbers = [];
  mappings.map(metadata => {
    const { docketNumber } = metadata;
    if (docketNumbers.includes(docketNumber)) {
      applicationContext.logger.warn(
        `Encountered duplicate eligible-for-trial-case-catalog mapping for case ${docketNumber}.`,
      );
    } else {
      docketNumbers.push(docketNumber);
    }
  });

  const results = await batchGet({
    applicationContext,
    keys: docketNumbers.map(docketNumber => ({
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    })),
  });

  const aggregatedResults = await Promise.all(
    results.map(async result => {
      const caseItems = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber: result.docketNumber,
        });

      return {
        ...result,
        ...caseItems,
      };
    }),
  );

  const afterMapping = docketNumbers.map(docketNumber => ({
    ...aggregatedResults.find(r => docketNumber === r.docketNumber),
  }));

  return afterMapping;
};
