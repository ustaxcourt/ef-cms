import { update } from '../../dynamodbClientService';

export const updateWorkItemTrialDate = ({
  applicationContext,
  docketNumber,
  trialDate,
  workItemId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  trialDate: string;
  workItemId: string;
}) =>
  update({
    ExpressionAttributeNames: {
      '#trialDate': 'trialDate',
    },
    ExpressionAttributeValues: {
      ':trialDate': trialDate,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #trialDate = :trialDate',
    applicationContext,
  });
