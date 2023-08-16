import { CasesClosedType } from '@shared/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { ConsolidatedCasesGroupCountMapResponseType } from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import {
  JudgeActivityReportFilters,
  OrdersReturnType,
} from '@shared/business/useCases/judgeActivityReport/getCountOfOrdersFiledByJudgesInteractor';
import { OpinionsReturnType } from '@shared/business/useCases/judgeActivityReport/getCountOfOpinionsFiledByJudgesInteractor';
import { TrialSessionReturnType } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';

export type JudgeActivityReportState = {
  filters: JudgeActivityReportFilters;
  judgeActivityReportData: {
    trialSessions?: TrialSessionReturnType;
    casesClosedByJudge?: CasesClosedType;
    consolidatedCasesGroupCountMap?: ConsolidatedCasesGroupCountMapResponseType;
    opinions?: OpinionsReturnType;
    orders?: OrdersReturnType;
    submittedAndCavCasesByJudge?: RawCase[];
    totalCountForSubmittedAndCavCases?: number;
  };
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judgeName: '',
    judges: [],
    startDate: '',
  },
  judgeActivityReportData: {},
};
