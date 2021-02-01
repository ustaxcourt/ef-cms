exports.updateUserEmail = async ({ applicationContext, user }) => {
  try {
    const response = await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
      })
      .promise();

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
        Username: response.Username,
      })
      .promise();
  } catch (err) {
    applicationContext.logger.error('Error updating user');
  }
};
