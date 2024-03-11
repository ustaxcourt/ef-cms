import * as client from '../../dynamodbClientService';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const createUserRecords = async ({
  applicationContext,
  newUser,
  userId,
}: {
  applicationContext: IApplicationContext;
  newUser: RawUser;
  userId: string;
}) => {
  await client.put({
    Item: {
      ...newUser,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  return {
    ...newUser,
    userId,
  };
};

export const createNewPetitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: RawUser;
}): Promise<void> => {
  const createUserPromise = applicationContext
    .getUserGateway()
    .createUser(applicationContext, {
      attributesToUpdate: {
        email: user.pendingEmail,
        name: user.name,
        role: ROLES.petitioner,
        userId: user.userId,
      },
      email: user.pendingEmail!,
      resendInvitationEmail: false,
    });

  const createUserRecordsPromise = createUserRecords({
    applicationContext,
    newUser: user,
    userId: user.userId,
  });

  await Promise.all([createUserPromise, createUserRecordsPromise]);
};
