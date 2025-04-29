import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { query } from '../../dynamodbClientService';

export const getEligibleCasesForTrialSession = async ({
  applicationContext,
  limit,
  skPrefix,
}: {
  applicationContext: ServerApplicationContext;
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

  const docketNumbers = new Set<string>();

  mappings.forEach(metadata => {
    const { docketNumber } = metadata;

    if (docketNumbers.has(docketNumber)) {
      applicationContext.logger.warn(
        `Encountered duplicate eligible-for-trial-case-catalog mapping for case ${docketNumber}.`,
      );
    } else {
      docketNumbers.add(docketNumber);
    }
  });

  const aggregatedResults = await Promise.all(
    [...docketNumbers].map(async docketNumber => {
      return await getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });
    }),
  );

  return aggregatedResults;
};
