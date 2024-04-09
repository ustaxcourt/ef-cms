export const isEmailAvailable = async ({ applicationContext, email }) => {
  const foundUser = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email,
    });
  return !!foundUser;
};
