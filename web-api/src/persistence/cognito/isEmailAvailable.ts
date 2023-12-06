import { isUserAlreadyCreated } from '../dynamo/users/createOrUpdateUser';

export const isEmailAvailable = async ({ applicationContext, email }) => {
  const inUse = await isUserAlreadyCreated({
    applicationContext,
    email,
    userPoolId: process.env.USER_POOL_ID,
  });
  return !inUse;
};
