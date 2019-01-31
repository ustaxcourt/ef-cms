export default async ({ applicationContext, path }) => {
  const users = await applicationContext
    .getUseCases()
    .getInternalUsers({ applicationContext });
  if (!users || !users.length) {
    return path.error({
      alertError: {
        title: 'User not found',
        message: 'Username or password are incorrect',
      },
    });
  } else {
    return path.success({
      users,
    });
  }
};
