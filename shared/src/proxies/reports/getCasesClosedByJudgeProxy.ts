import { CasesClosedType } from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getCasesClosedByJudgeInteractor = (
  applicationContext,
  {
    currentJudgesNames,
    endDate,
    judgeName,
    startDate,
  }: {
    startDate: string;
    endDate: string;
    judgeName: string;
    currentJudgesNames: string[];
  },
): Promise<CasesClosedType> => {
  return post({
    applicationContext,
    body: {
      currentJudgesNames,
      endDate,
      judgeName,
      startDate,
    },
    endpoint: '/judge-activity-report/closed-cases',
  });
};
