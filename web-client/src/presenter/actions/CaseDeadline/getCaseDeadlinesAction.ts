import { CASE_DEADLINES_REPORT_PAGE_SIZE } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * get case deadlines between start and end date and can be filtered by judge
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {function} providers.get the get function
 * @returns {object} the case deadlines and total count of returned case deadlines
 */
export const getCaseDeadlinesAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const startDate = get(state.screenMetadata.filterStartDate);
  const endDate = get(state.screenMetadata.filterEndDate);
  const judgeFilter = get(state.caseDeadlineReport.judgeFilter);
  const from = props.selectedPage
    ? props.selectedPage * CASE_DEADLINES_REPORT_PAGE_SIZE
    : 0;

  const { deadlines, totalCount } = await applicationContext
    .getUseCases()
    .getCaseDeadlinesInteractor(applicationContext, {
      endDate,
      from,
      judge: judgeFilter,
      startDate,
    });

  return { caseDeadlines: deadlines, totalCount };
};
