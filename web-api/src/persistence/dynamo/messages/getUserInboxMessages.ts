import { RawMessage } from '@shared/business/entities/Message';
import { queryFull } from '../../dynamodbClientService';

export const getUserInboxMessages = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<RawMessage[]> => {
  const results = (await queryFull({
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
  })) as RawMessage[];

  return results;
};
