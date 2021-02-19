const { getUserById } = require('./getUserById');
const { updateUserRecords } = require('./updateUserRecords');

exports.updatePractitionerUser = async ({ applicationContext, user }) => {
  const { userId } = user;

  const oldUser = await getUserById({
    applicationContext,
    userId,
  });

  console.log('userrrr', user);

  try {
    const response = await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
      })
      .promise();

    if (response) {
      await applicationContext
        .getCognito()
        .adminUpdateUserAttributes({
          UserAttributes: [
            {
              Name: 'custom:role',
              Value: user.role,
            },
          ],
          UserPoolId: process.env.USER_POOL_ID,
          Username: response.Username,
        })
        .promise();
    }
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
