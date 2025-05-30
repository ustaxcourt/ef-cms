import { ServerApplicationContext } from '@web-api/applicationContext';
import { query } from '../../dynamodbClientService';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export const getEligibleCasesForTrialSession = async ({
  applicationContext,
  limit,
  skPrefix,
}: {
  applicationContext: ServerApplicationContext;
  limit: number;
  skPrefix: string;
}): Promise<Omit<RawCase, 'consolidatedCases'>[]> => {
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

  const aggregatedResults = await getCasesByDocketNumbers({
    docketNumbers: [...docketNumbers],
  });

  return aggregatedResults;
};
