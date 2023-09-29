import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { CasesClosedReturnType } from '@shared/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { CavAndSubmittedFilteredCasesType } from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { JudgeActivityReportFilters } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { TrialSessionReturnType } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';

type JudgeActivityReportData = {
  trialSessions: TrialSessionReturnType;
  casesClosedByJudge: CasesClosedReturnType;
  opinions: AggregatedEventCodesType;
  orders: AggregatedEventCodesType;
  submittedAndCavCasesByJudge: CavAndSubmittedFilteredCasesType[];
  totalCountForSubmittedAndCavCases: number;
};

export type JudgeActivityReportState = {
  filters: JudgeActivityReportFilters;
  judgeActivityReportData: JudgeActivityReportData;
  judgeNameToDisplayForHeader: string;
  judgeName: string;
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judges: [],
    startDate: '',
  },
  judgeActivityReportData: {} as JudgeActivityReportData,
  judgeName: '',
  judgeNameToDisplayForHeader: '',
};
