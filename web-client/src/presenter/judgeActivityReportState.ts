import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { CasesClosedReturnType } from '@shared/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { GetCasesByStatusAndByJudgeResponse } from '@shared/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { JudgeActivityReportFilters } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { TrialSessionReturnType } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';

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
  judgeNameToDisplayForHeader: string;
  judgeName: string;
  hasUserSubmittedForm: boolean;
};

const initialJudgeActivityReportData: JudgeActivityReportData = {
  casesClosedByJudge: {
    aggregations: { Closed: 0, 'Closed - Dismissed': 0 },
    total: 0,
  },
  opinions: {
    aggregations: [],
    total: 0,
  },
  orders: {
    aggregations: [],
    total: 0,
  },
  submittedAndCavCasesByJudge: [],
  trialSessions: {
    aggregations: {
      Hybrid: 0,
      'Motion/Hearing': 0,
      Regular: 0,
      Small: 0,
      Special: 0,
    },
    total: 0,
  },
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judges: [],
    startDate: '',
  },
  hasUserSubmittedForm: false,
  judgeActivityReportData: initialJudgeActivityReportData,
  judgeName: '',
  judgeNameToDisplayForHeader: '',
};
