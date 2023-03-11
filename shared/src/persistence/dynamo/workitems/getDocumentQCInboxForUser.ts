import { query } from '../../dynamodbClientService';

export const getDocumentQCInboxForUser = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  const workItems = await query({
    ExpressionAttributeNames: {
      '#gsi2pk': 'gsi2pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi2pk': `assigneeId|${userId}`,
      ':prefix': 'work-item',
    },
    IndexName: 'gsi2',
    KeyConditionExpression: '#gsi2pk = :gsi2pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return workItems
    .filter(workItem => !workItem.completedAt)
    .sort((a, b) => {
      if (a.highPriority) {
        return -1;
      }

      if (b.highPriority) {
        return 1;
      }

      return 0;
    });
};
