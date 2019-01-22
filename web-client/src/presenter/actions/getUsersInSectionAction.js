export default section => async ({ applicationContext }) => {
  const users = await applicationContext
    .getUseCases()
    .getUsersInSection({ section, applicationContext });
  return {
    users,
  };
};
