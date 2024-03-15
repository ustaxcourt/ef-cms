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
      '#gsiUserBox': 'gsiUserBox',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsiUserBox': `assigneeId|${userId}`,
      ':prefix': 'message',
    },
    IndexName: 'gsiUserBox',
    KeyConditionExpression:
      '#gsiUserBox = :gsiUserBox and begins_with(#sk, :prefix)',
    applicationContext,
  })) as RawMessage[];

  return results;
};
