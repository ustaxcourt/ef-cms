export default section => async ({ applicationContext, path }) => {
  const users = await applicationContext
    .getUseCases()
    .getUsersInSection({ sectionType: section });
  return path.success({
    users,
  });
};
