import { put } from '../../dynamodbClientService';

export const associateUserWithCasePending = ({
  applicationContext,
  docketNumber,
  userId,
}) =>
  put({
    Item: {
      pk: `user|${userId}`,
      sk: `pending-case|${docketNumber}`,
    },
    applicationContext,
  });
