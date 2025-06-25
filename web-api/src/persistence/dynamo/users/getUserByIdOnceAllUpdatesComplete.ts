import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const getUserByIdOnceAllUpdatesComplete = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<UserRecord> => {
  const user = await getUserById({ userId });

  if (!user.isUpdatingInformation) return user;

  await applicationContext.getUtilities().sleep(1500);
  return await getUserByIdOnceAllUpdatesComplete({
    applicationContext,
    userId,
  });
};
