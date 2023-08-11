import { query } from '../../dynamodbClientService';

/**
 * getCasesByLeadDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.leadDocketNumber the lead case docket number
 * @returns {Promise} the promise of the call to persistence
 */
export const getCasesByLeadDocketNumber = async ({
  applicationContext,
  includeDocketEntries = true,
  leadDocketNumber,
}: {
  applicationContext: IApplicationContext;
  leadDocketNumber: string;
  includeDocketEntries?: boolean;
}) => {
  let consolidatedCases = await query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `case|${leadDocketNumber}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  const cases = await Promise.all(
    consolidatedCases.map(({ docketNumber }) =>
      includeDocketEntries
        ? applicationContext.getPersistenceGateway().getCaseByDocketNumber({
            applicationContext,
            docketNumber,
          })
        : applicationContext
            .getPersistenceGateway()
            .getCaseMetadataWithCounsel({
              applicationContext,
              docketNumber,
            }),
    ),
  );

  return cases;
};

// getCaseMetadataWithCounsel
