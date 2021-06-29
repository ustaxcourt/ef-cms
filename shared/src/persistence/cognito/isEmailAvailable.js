exports.isEmailAvailable = async ({ applicationContext, email }) => {
  try {
    await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
      })
      .promise();
  } catch (e) {
    return true;
  }
  //If an error is not thrown, we can assume a user was found
  return false;
};
