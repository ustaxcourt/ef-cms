import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { CasesClosedReturnType } from '@web-api/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { GetCasesByStatusAndByJudgeResponse } from '@web-api/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { JudgeActivityReportFilters } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { TrialSessionReturnType } from '@web-api/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';

export type InputOption<T = string> = {
  label: string;
  value?: T;
  options?: InputOption[];
};

type JudgeActivityReportData = {
  trialSessions: TrialSessionReturnType;
  casesClosedByJudge: CasesClosedReturnType;
  opinions: AggregatedEventCodesType;
  orders: AggregatedEventCodesType;
  submittedAndCavCasesByJudge: GetCasesByStatusAndByJudgeResponse[];
};

export type JudgeActivityReportState = {
  filters: JudgeActivityReportFilters;
  judgeActivityReportData: JudgeActivityReportData;
  hasUserSubmittedForm: boolean;
};
