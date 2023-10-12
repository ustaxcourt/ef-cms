import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { get } from '../../dynamodbClientService';

export const getUserById = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<UserRecord> =>
  get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
