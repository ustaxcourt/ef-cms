import { update } from '../../dynamodbClientService';

exports.updateWorkItemAssociatedJudge = ({
  applicationContext,
  associatedJudge,
  docketNumber,
  workItemId,
}: {
  applicationContext: IApplicationContext;
  associatedJudge: string;
  docketNumber: string;
  workItemId: string;
}) =>
  update({
    ExpressionAttributeNames: {
      '#associatedJudge': 'associatedJudge',
    },
    ExpressionAttributeValues: {
      ':associatedJudge': associatedJudge,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #associatedJudge = :associatedJudge',
    applicationContext,
  });
