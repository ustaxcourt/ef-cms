import { RawUser } from '@shared/business/entities/User';
import { put } from '../../dynamodbClientService';

export const persistUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}): Promise<void> => {
  await put({
    Item: {
      ...user,
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
    },
    applicationContext,
  });
};
