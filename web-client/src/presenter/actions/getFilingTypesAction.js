export const getFilingTypesAction = async ({ applicationContext }) => {
  const filingTypes = await applicationContext.getUseCases().getFilingTypes({
    applicationContext,
  });
  return { filingTypes };
};
