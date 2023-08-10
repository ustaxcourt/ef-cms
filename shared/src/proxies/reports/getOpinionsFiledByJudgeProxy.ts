import {
  JudgeActivityReportFilters,
  OpinionsReturnType,
} from '@web-client/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getOpinionsFiledByJudgeInteractor = (
  applicationContext,
  params: JudgeActivityReportFilters,
): Promise<OpinionsReturnType> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/opinions',
  });
};
