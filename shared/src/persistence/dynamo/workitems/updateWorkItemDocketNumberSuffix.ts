import { update } from '../../dynamodbClientService';

export const updateWorkItemDocketNumberSuffix = ({
  applicationContext,
  docketNumber,
  docketNumberSuffix,
  workItemId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  docketNumberSuffix: string;
  workItemId: string;
}) =>
  update({
    ExpressionAttributeNames: {
      '#docketNumberSuffix': 'docketNumberSuffix',
    },
    ExpressionAttributeValues: {
      ':docketNumberSuffix': docketNumberSuffix,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #docketNumberSuffix = :docketNumberSuffix',
    applicationContext,
  });
