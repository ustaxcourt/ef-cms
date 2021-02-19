exports.updateUserEmail = async ({ applicationContext, user }) => {
  let username;
  try {
    ({ Username: username } = await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
      })
      .promise());

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
        Username: username,
      })
      .promise();
  } catch (err) {
    console.log(username, err);
    applicationContext.logger.error(`Error updating user ${username}`);
  }
};
