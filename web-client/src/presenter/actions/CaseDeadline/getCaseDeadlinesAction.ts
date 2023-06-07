import { state } from 'cerebral';

export const getCaseDeadlinesAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
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
