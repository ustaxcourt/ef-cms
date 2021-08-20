const { isUserAlreadyCreated } = require('../dynamo/users/createOrUpdateUser');

exports.isEmailAvailable = async ({ applicationContext, email }) => {
  const inUse = await isUserAlreadyCreated({
    UserPoolId: process.env.USER_POOL_ID,
    applicationContext,
    email,
  });
  return !inUse;
};
