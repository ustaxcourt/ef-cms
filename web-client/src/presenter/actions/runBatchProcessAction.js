/**
 * runs the Send to IRS batch process
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context needed for getting the updateCase use case
 */
export const runBatchProcessAction = async ({ applicationContext }) => {
  await applicationContext.getUseCases().runBatchProcess({
    applicationContext,
  });
};
