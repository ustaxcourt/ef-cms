export const getFilingTypesAction = async ({ applicationContext }) => {
  const filingTypes = await applicationContext
    .getUseCases()
    .getFilingTypesInteractor({
      applicationContext,
    });
  return { filingTypes };
};
