import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { queryFull } from '../../dynamodbClientService';

export const getDocumentQCForSection = async ({
  applicationContext,
  box,
  judgeUserName,
  section,
}: {
  applicationContext: IApplicationContext;
  box: 'inbox' | 'inProgress' | 'served';
  judgeUserName?: string;
  section: string;
}): Promise<RawWorkItem[]> => {
  const gsi = box === 'served' ? 4 : 3;

  const results = (await queryFull({
    ExpressionAttributeNames: {
      [`#gsi${gsi}pk`]: `gsi${gsi}pk`,
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      [`:gsi${gsi}pk`]: `section|${box}|${section}`,
      ':prefix': 'work-item',
    },
    IndexName: `gsi${gsi}`,
    KeyConditionExpression: `#gsi${gsi}pk = :gsi${gsi}pk and begins_with(#sk, :prefix)`,
    applicationContext,
  })) as RawWorkItem[];

  return results.filter(
    result => !judgeUserName || result.associatedJudge === judgeUserName,
  );
};
