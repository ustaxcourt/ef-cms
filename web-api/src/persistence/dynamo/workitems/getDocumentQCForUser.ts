import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { queryFull } from '../../dynamodbClientService';

export const getDocumentQCForUser = async ({
  applicationContext,
  box,
  userId,
}: {
  applicationContext: IApplicationContext;
  box: 'inbox' | 'inProgress';
  userId: string;
}): Promise<RawWorkItem[]> => {
  const workItems: RawWorkItem[] = (await queryFull({
    ExpressionAttributeNames: {
      '#gsiUserBox': 'gsiUserBox',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsiUserBox': `assigneeId|${box}|${userId}`,
      ':prefix': 'work-item',
    },
    IndexName: 'gsiUserBox',
    KeyConditionExpression:
      '#gsiUserBox = :gsiUserBox and begins_with(#sk, :prefix)',
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
