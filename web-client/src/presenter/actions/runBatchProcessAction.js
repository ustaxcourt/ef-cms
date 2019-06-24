/**
 * runs the Send to IRS batch process
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the updateCase use case
 * @returns {Promise} async action
 */
export const runBatchProcessAction = async ({ applicationContext }) => {
  await applicationContext.getUseCases().runBatchProcess({
    applicationContext,
  });
};
