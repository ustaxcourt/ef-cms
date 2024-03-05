import { queryFull } from '../../dynamodbClientService';

export const getSectionInboxMessages = async ({
  applicationContext,
  section,
}) => {
  const results = await queryFull({
    ExpressionAttributeNames: {
      '#gsiSectionBox': 'gsiSectionBox',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsiSectionBox': `section|${section}`,
      ':prefix': 'message',
    },
    IndexName: 'gsiSectionBox',
    KeyConditionExpression:
      '#gsiSectionBox = :gsiSectionBox and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return results;
};
