import { queryFull } from '../../dynamodbClientService';

export const getCompletedSectionInboxMessages = async ({
  applicationContext,
  section,
}) => {
  const results = await queryFull({
    ExpressionAttributeNames: {
      '#gsi2pk': 'gsi2pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi2pk': `assigneeId|inbox|${section}`,
      ':prefix': 'message',
    },
    IndexName: 'gsi2',
    KeyConditionExpression: '#gsi2pk = :gsi2pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  // applicationContext.logger.info('getCompletedSectionInboxMessages end');

  return results;
};
