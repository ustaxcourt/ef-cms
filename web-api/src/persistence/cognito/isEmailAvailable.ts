import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';

export const isEmailAvailable = async ({ applicationContext, email }) => {
  const foundUser = await getUserByEmail(applicationContext, {
    email,
  });
  return !foundUser;
};
