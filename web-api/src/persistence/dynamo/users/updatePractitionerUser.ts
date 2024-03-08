import { RawUser } from '@shared/business/entities/User';
import { getUserById } from './getUserById';
import { updateUserRecords } from './updateUserRecords';

export const updatePractitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
  const { userId } = user;

  const oldUser = await getUserById({
    applicationContext,
    userId,
  });

  try {
    await applicationContext.getCognito().adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: user.role,
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: user.email ? user.email : user.pendingEmail,
    });
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  }

  const updatedUser = await updateUserRecords({
    applicationContext,
    oldUser,
    updatedUser: user,
    userId,
  });

  return updatedUser;
};
