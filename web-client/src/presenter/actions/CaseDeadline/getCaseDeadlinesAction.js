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
  const judgeFilter = get(state.caseDeadlineReport.judgeFilter);
  const page = get(state.caseDeadlineReport.page) || 1;

  const { deadlines, totalCount } = await applicationContext
    .getUseCases()
    .getCaseDeadlinesInteractor(applicationContext, {
      endDate,
      judge: judgeFilter,
      page,
      startDate,
    });
  return { caseDeadlines: deadlines, totalCount };
};
