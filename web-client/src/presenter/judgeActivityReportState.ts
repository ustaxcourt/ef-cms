import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { CasesClosedType } from '@shared/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { JudgeActivityReportFilters } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { TrialSessionReturnType } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';

export type JudgeActivityReportState = {
  filters: JudgeActivityReportFilters;
  judgeActivityReportData: {
    trialSessions?: TrialSessionReturnType;
    casesClosedByJudge?: CasesClosedType;
    opinions?: AggregatedEventCodesType;
    orders?: AggregatedEventCodesType;
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
