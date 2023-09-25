import * as client from '../../dynamodbClientService';
import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';

export const getUserById = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<UserRecord> =>
  client.get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
