export default async ({ applicationContext }) => {
  const caseTypes = await applicationContext.getUseCases().getCaseTypes({
    applicationContext,
  });
  return { caseTypes };
};
