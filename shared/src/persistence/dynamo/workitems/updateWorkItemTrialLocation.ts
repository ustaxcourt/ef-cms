import { update } from '../../dynamodbClientService';

export const updateWorkItemTrialLocation = ({
  applicationContext,
  docketNumber,
  trialLocation,
  workItemId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  trialLocation: string;
  workItemId: string;
}) =>
  update({
    ExpressionAttributeNames: {
      '#trialLocation': 'trialLocation',
    },
    ExpressionAttributeValues: {
      ':trialLocation': trialLocation,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #trialLocation = :trialLocation',
    applicationContext,
  });
