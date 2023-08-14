export const getCognitoUserIdByEmail = async ({
  applicationContext,
  email,
}) => {
  try {
    const userFromCognito = await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
      })
      .promise();

    const customUserId = (
      userFromCognito.UserAttributes.find(
        attribute => attribute.Name === 'custom:userId',
      ) || {}
    ).Value;
    return customUserId || userFromCognito.Username;
  } catch (e) {
    return null;
  }
};
