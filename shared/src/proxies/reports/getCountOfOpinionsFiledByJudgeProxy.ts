import { JudgeActivityReportFilters } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { post } from '../requests';

export const getCountOfOpinionsFiledByJudgesInteractor = (
  applicationContext,
  params: JudgeActivityReportFilters,
): Promise<OpinionsReturnType> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/opinions',
  });
};
