import { queryFull } from '../../dynamodbClientService';

export const getCompletedSectionInboxMessages = async ({
  applicationContext,
  section,
}) => {
  const results = await queryFull({
    ExpressionAttributeNames: {
      '#gsi5pk': 'gsi5pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi5pk': `section|completed|${section}`,
      ':prefix': 'message',
    },
    IndexName: 'gsi5',
    KeyConditionExpression: '#gsi5pk = :gsi5pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return results;
};
