import { queryFull } from '../../dynamodbClientService';

export const getUserInboxMessages = async ({ applicationContext, userId }) => {
  const results = await queryFull({
    ExpressionAttributeNames: {
      '#gsi2pk': 'gsi2pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi2pk': `assigneeId|inbox|${userId}`,
      ':prefix': 'message',
    },
    IndexName: 'gsi2',
    KeyConditionExpression: '#gsi2pk = :gsi2pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return results;
};
