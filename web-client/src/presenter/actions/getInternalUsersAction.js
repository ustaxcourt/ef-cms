export default async ({ applicationContext }) => {
  const users = await applicationContext
    .getUseCases()
    .getInternalUsers({ applicationContext });
  return { users };
};
