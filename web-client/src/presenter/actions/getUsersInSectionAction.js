export default section => async ({ applicationContext, path }) => {
  const users = await applicationContext
    .getUseCases()
    .getUsersInSection({ section, applicationContext });
  return path.success({
    users,
  });
};
