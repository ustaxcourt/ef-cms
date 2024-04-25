import { queryFull } from '../../dynamodbClientService';

export const getConsolidatedCasesCount = async ({
  applicationContext,
  leadDocketNumber,
}) => {
  const consolidatedCaseItems = await queryFull<RawCase[]>({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `leadCase|${leadDocketNumber}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  return consolidatedCaseItems.length;
};
