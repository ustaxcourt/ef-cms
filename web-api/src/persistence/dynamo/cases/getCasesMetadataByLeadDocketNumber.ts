import { query } from '../../dynamodbClientService';

export const getCasesMetadataByLeadDocketNumber = async ({
  applicationContext,
  leadDocketNumber,
}: {
  applicationContext: IApplicationContext;
  leadDocketNumber: string;
}) => {
  const consolidatedGroup = await query({
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

  return await Promise.all(
    consolidatedGroup.map(({ docketNumber }) =>
      applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel({
        applicationContext,
        docketNumber,
      }),
    ),
  );
};
