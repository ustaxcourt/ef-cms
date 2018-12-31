export default section => async ({ applicationContext, path }) => {
  const users = await applicationContext
    .getUseCases()
    .getUsersInSection(section);
  return path.success({
    users,
  });
};
