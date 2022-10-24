import { update } from '../../dynamodbClientService';

export const updateWorkItemCaseTitle = ({
  applicationContext,
  caseTitle,
  docketNumber,
  workItemId,
}: {
  applicationContext: IApplicationContext;
  caseTitle: string;
  docketNumber: string;
  workItemId: string;
}) =>
  update({
    ExpressionAttributeNames: {
      '#caseTitle': 'caseTitle',
    },
    ExpressionAttributeValues: {
      ':caseTitle': caseTitle,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #caseTitle = :caseTitle',
    applicationContext,
  });
