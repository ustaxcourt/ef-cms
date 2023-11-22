import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { queryFull } from '../../dynamodbClientService';

export const getDocumentQCInboxForUser = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<RawWorkItem[]> => {
  const workItems: RawWorkItem[] = (await queryFull({
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
  })) as any;

  return workItems.sort((a, b) => {
    if (a.highPriority) {
      return -1;
    }

    if (b.highPriority) {
      return 1;
    }

    return 0;
  });
};
