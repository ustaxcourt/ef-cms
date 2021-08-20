exports.isEmailAvailable = async ({ applicationContext, email }) => {
  try {
    await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
      })
      .promise();
    return false;
  } catch (e) {
    return true;
  }
};
