import {
  CasesClosedType,
  JudgeActivityReportRequestType,
} from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getCasesClosedByJudgeInteractor = (
  applicationContext,
  { endDate, judgesSelection, startDate }: JudgeActivityReportRequestType,
): Promise<CasesClosedType> => {
  return post({
    applicationContext,
    body: {
      endDate,
      judgesSelection,
      startDate,
    },
    endpoint: '/judge-activity-report/closed-cases',
  });
};
