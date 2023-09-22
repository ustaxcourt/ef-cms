import * as client from '../../dynamodbClientService';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';

export const getUserById = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<TDynamoRecord> =>
  client.get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
