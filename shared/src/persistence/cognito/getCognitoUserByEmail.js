exports.getCognitoUserByEmail = async ({ applicationContext, email }) => {
  const { Users: users } = await applicationContext
    .getCognito()
    .listUsers({
      Filter: `email = "${email}"`, // TODO: check for possible email injection?  do we need to validate this is an email for sure?
      UserPoolId: process.env.USER_POOL_ID,
    })
    .promise();

  return users.length ? users[0] : null;
};
