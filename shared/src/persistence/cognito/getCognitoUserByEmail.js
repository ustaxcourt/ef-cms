exports.getCognitoUserByEmail = async ({ applicationContext, email }) => {
  try {
    return await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
      })
      .promise();
  } catch (e) {
    return null;
  }
};
