import { update } from '../../dynamodbClientService';

export const setMessageAsRead = ({
  applicationContext,
  docketNumber,
  messageId,
}: {
  applicationContext: IApplicationContext;
  messageId: string;
  docketNumber: string;
}) =>
  update({
    ExpressionAttributeNames: {
      '#isRead': 'isRead',
    },
    ExpressionAttributeValues: {
      ':isRead': true,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `message|${messageId}`,
    },
    UpdateExpression: 'SET #isRead = :isRead',
    applicationContext,
  });
