/**
 * get all the case deadlines
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the case deadlines
 */
export const getAllCaseDeadlinesAction = async ({ applicationContext }) => {
  const caseDeadlines = await applicationContext
    .getUseCases()
    .getAllCaseDeadlinesInteractor({
      applicationContext,
    });
  return { caseDeadlines };
};
