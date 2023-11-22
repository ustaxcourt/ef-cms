import * as client from '../../dynamodbClientService';
import { RawUser } from '@shared/business/entities/User';

export const updateUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
  await client.put({
    Item: {
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
      ...user,
    },
    applicationContext,
  });
};
