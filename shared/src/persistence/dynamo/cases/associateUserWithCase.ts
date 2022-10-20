import { put } from '../../dynamodbClientService';

export const associateUserWithCase = ({
  applicationContext,
  docketNumber,
  userCase,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  userCase: TCase;
  userId: string;
}) =>
  put({
    Item: {
      ...userCase,
      gsi1pk: `user-case|${docketNumber}`,
      pk: `user|${userId}`,
      sk: `case|${docketNumber}`,
    },
    applicationContext,
  });
