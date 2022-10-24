import { update } from '../../dynamodbClientService';

export const updateWorkItemCaseStatus = ({
  applicationContext,
  caseStatus,
  docketNumber,
  workItemId,
}: {
  applicationContext: IApplicationContext;
  caseStatus: string;
  docketNumber: string;
  workItemId: string;
}) =>
  update({
    ExpressionAttributeNames: {
      '#caseStatus': 'caseStatus',
    },
    ExpressionAttributeValues: {
      ':caseStatus': caseStatus,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #caseStatus = :caseStatus',
    applicationContext,
  });
