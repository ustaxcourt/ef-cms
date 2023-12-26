import { CAV_AND_SUBMITTED_CASE_STATUS } from '../../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getSubmittedAndCavCasesByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const filters = get(state.judgeActivityReport.filters);

  const judges = filters.judges?.length
    ? filters.judges
    : [get(state.judgeActivityReport.judgeName)];

  const { cases } = await applicationContext
    .getUseCases()
    .getCaseWorksheetsByJudgeInteractor(applicationContext, {
      judges,
      statuses: CAV_AND_SUBMITTED_CASE_STATUS,
    });

  return {
    cases,
  };
};
