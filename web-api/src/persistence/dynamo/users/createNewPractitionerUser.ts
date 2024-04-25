import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { put } from '../../dynamodbClientService';

export const updateUserRecords = async ({
  applicationContext,
  updatedUser,
  userId,
}: {
  applicationContext: ServerApplicationContext;
  updatedUser: RawPractitioner;
  userId: string;
}): Promise<RawPractitioner> => {
  await Promise.all([
    put({
      Item: {
        ...updatedUser,
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        userId,
      },
      applicationContext,
    }),
    put({
      Item: {
        pk: `${updatedUser.role}|${updatedUser.name.toUpperCase()}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    }),
    put({
      Item: {
        pk: `${updatedUser.role}|${updatedUser.barNumber.toUpperCase()}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    }),
  ]);

  return {
    ...updatedUser,
    userId,
  };
};

export const createNewPractitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: RawPractitioner;
}): Promise<RawPractitioner> => {
  await applicationContext.getUserGateway().createUser(applicationContext, {
    attributesToUpdate: {
      email: user.pendingEmail,
      name: user.name,
      role: user.role,
      userId: user.userId,
    },
    email: user.pendingEmail!,
    resendInvitationEmail: false,
  });

  return await updateUserRecords({
    applicationContext,
    updatedUser: user,
    userId: user.userId,
  });
};
