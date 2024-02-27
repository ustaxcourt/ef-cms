import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { queryFull } from '../../dynamodbClientService';

export const getDocumentQCForSection = async ({
  applicationContext,
  box,
  judgeUserId,
  judgeUserName,
  section,
}: {
  applicationContext: IApplicationContext;
  box: 'inbox' | 'inProgress' | 'outbox';
  judgeUserName?: string;
  judgeUserId?: string;
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

  if (judgeUserName) {
    return results.filter(result => result.associatedJudge === judgeUserName);
  } else if (judgeUserId) {
    return results.filter(result => result.associatedJudgeId === judgeUserId);
  } else return results;
};
