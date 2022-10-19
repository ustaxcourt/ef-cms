import { update } from '../../dynamodbClientService';

export const updateWorkItemTrialDate = ({
  applicationContext,
  docketNumber,
  trialDate,
  workItemId,
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
