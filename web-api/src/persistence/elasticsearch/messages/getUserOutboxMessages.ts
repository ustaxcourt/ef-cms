import { queryFull } from '@web-api/persistence/dynamodbClientService';

export const getUserOutboxMessages = async ({ applicationContext, userId }) => {
  const results = await queryFull({
    ExpressionAttributeNames: {
      '#gsi3pk': 'gsi3pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi3pk': `assigneeId|outbox|${userId}`,
      ':prefix': 'message',
    },
    IndexName: 'gsi3',
    KeyConditionExpression: '#gsi3pk = :gsi3pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return results;
};
