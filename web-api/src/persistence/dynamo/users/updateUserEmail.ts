import { RawUser } from '@shared/business/entities/User';

export const updateUserEmail = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
  try {
    await applicationContext
      .getCognito()
      .adminUpdateUserAttributes({
        UserAttributes: [
          {
            Name: 'email',
            Value: user.pendingEmail,
          },
          {
            Name: 'email_verified',
            Value: 'true',
          },
        ],
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
      })
      .promise();
  } catch (err) {
    applicationContext.logger.error(
      `Error updating user with original email ${user.email}`,
    );
    throw err;
  }
};
