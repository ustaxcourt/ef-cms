import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';

export const getUserByIdOnceAllUpdatesComplete = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<UserRecord> => {
  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  if (!user.isUpdatingInformation) return user;

  await applicationContext.getUtilities().sleep(1500);
  return await getUserByIdOnceAllUpdatesComplete({
    applicationContext,
    userId,
  });
};
