import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { queryFull } from '../../dynamodbClientService';

export const getDocumentQCForSection = async ({
  applicationContext,
  box,
  judgeUserName,
  section,
}: {
  applicationContext: IApplicationContext;
  box: 'inbox' | 'inProgress' | 'outbox';
  judgeUserName?: string;
  section: string;
}): Promise<RawWorkItem[]> => {
  const results = (await queryFull({
    ExpressionAttributeNames: {
      '#gsi3pk': 'gsi3pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi3pk': `section|${box}|${section}`,
      ':prefix': 'work-item',
    },
    IndexName: 'gsi3',
    KeyConditionExpression: '#gsi3pk = :gsi3pk and begins_with(#sk, :prefix)',
    applicationContext,
  })) as RawWorkItem[];

  return results.filter(
    result => !judgeUserName || result.associatedJudge === judgeUserName,
  );
};
