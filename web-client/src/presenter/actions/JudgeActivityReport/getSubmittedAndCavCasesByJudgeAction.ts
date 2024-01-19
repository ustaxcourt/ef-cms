import { CAV_AND_SUBMITTED_CASE_STATUS } from '../../../../../shared/src/business/entities/EntityConstants';
import { getJudgesFilters } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesAction';

export const getSubmittedAndCavCasesByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { cases } = await applicationContext
    .getUseCases()
    .getCaseWorksheetsByJudgeInteractor(applicationContext, {
      judges: getJudgesFilters(get).map(judge => judge.name),
      statuses: CAV_AND_SUBMITTED_CASE_STATUS,
    });

  return {
    cases,
  };
};
