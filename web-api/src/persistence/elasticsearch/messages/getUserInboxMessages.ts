import { queryFull } from '../../dynamodbClientService';

export const getUserInboxMessages = async ({ applicationContext, userId }) => {
  applicationContext.logger.info('getUserInboxMessages start');

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

  applicationContext.logger.info('getUserInboxMessages end');

  return results;
};

export const getUserInboxMessageCount = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<number> => {
  const results = await queryFull({
    ExpressionAttributeNames: {
      '#gsi2pk': 'gsi2pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi2pk': `user|inbox|${userId}`,
      ':prefix': 'message',
    },
    IndexName: 'gsi2',
    KeyConditionExpression: '#gsi2pk = :gsi2pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return results.length;
};
