export default async ({ applicationContext }) => {
  const procedureTypes = await applicationContext
    .getUseCases()
    .getProcedureTypes({
      applicationContext,
    });
  return { procedureTypes };
};
