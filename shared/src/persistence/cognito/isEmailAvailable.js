const { isUserAlreadyCreated } = require('../dynamo/users/createOrUpdateUser');

exports.isEmailAvailable = async ({ applicationContext, email }) => {
  const inUse = await isUserAlreadyCreated({
    applicationContext,
    email,
    userPoolId: process.env.USER_POOL_ID,
  });
  return !inUse;
};
