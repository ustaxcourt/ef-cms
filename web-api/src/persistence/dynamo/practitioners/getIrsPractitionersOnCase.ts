import { ServerApplicationContext } from '@web-api/applicationContext';
import { query } from '@web-api/persistence/dynamodbClientService';

export const getIrsPractitionersOnCase = async ({
  docketNumber,
  applicationContext,
}: {
  docketNumber: string;
  applicationContext: ServerApplicationContext;
}) => {
  return await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
      ':prefix': 'irsPractitioner',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
};
