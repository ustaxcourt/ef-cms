import { queryFull } from '../../dynamodbClientService';

export const getSectionInboxMessages = async ({
  applicationContext,
  section,
}) => {
  const results = await queryFull({
    ExpressionAttributeNames: {
      '#gsi3pk': 'gsi3pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi3pk': `section|${section}`,
      ':prefix': 'message',
    },
    IndexName: 'gsi3',
    KeyConditionExpression: '#gsi3pk = :gsi3pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return results;
};
