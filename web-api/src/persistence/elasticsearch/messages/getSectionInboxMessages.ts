import { queryFull } from '../../dynamodbClientService';

export const getSectionInboxMessages = async ({
  applicationContext,
  section,
}) => {
  const results = await queryFull({
    ExpressionAttributeNames: {
      '#gsi4pk': 'gsi4pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi4pk': `section|inbox|${section}`,
      ':prefix': 'message',
    },
    IndexName: 'gsi4',
    KeyConditionExpression: '#gsi4pk = :gsi4pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return results;
};
