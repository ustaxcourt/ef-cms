import * as client from '../../dynamodbClientService';
import { RawUser } from '@shared/business/entities/User';

export const persistUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
  await client.put({
    Item: {
      ...user,
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
    },
    applicationContext,
  });
};
