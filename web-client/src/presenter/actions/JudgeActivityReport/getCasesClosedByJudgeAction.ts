import { getJudgesFilters } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesAction';
import { state } from '@web-client/presenter/app.cerebral';

export const getCasesClosedByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, startDate } = get(state.judgeActivityReport.filters);

  const casesClosedByJudge = await applicationContext
    .getUseCases()
    .getCasesClosedByJudgeInteractor(applicationContext, {
      endDate,
      judges: getJudgesFilters(get).map(judge => judge.name),
      startDate,
    });

  return { casesClosedByJudge };
};
