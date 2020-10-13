import { state } from 'cerebral';

/**
 * get case deadlines between start and end date
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {function} providers.get the get function
 * @returns {object} the case deadlines
 */
export const getCaseDeadlinesAction = async ({ applicationContext, get }) => {
  const startDate = get(state.screenMetadata.filterStartDate);
  const endDate = get(state.screenMetadata.filterEndDate);

  const caseDeadlines = await applicationContext
    .getUseCases()
    .getCaseDeadlinesInteractor({
      applicationContext,
      endDate,
      startDate,
    });
  return { caseDeadlines };
};
