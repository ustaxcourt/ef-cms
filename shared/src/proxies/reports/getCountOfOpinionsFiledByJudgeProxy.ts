import { JudgeActivityReportFilters } from '@shared/business/useCases/judgeActivityReport/getCountOfOrdersFiledByJudgesInteractor';
import { OpinionsReturnType } from '@shared/business/useCases/judgeActivityReport/getCountOfOpinionsFiledByJudgesInteractor';
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
