import { query } from '../../dynamodbClientService';

export const getDocumentQCInboxForUser = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) =>
  query({
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
