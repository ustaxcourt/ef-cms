import { RawTrialSession } from './../../../shared/src/business/entities/trialSessions/TrialSession';
export type JudgeActitivityReportFilters = {
  endDate: string;
  startDate: string;
  judgeName: string;
};

export type JudgeActivityReportState = {
  filters: JudgeActitivityReportFilters;
  judgeActivityReportData: {
    trialSessions?: RawTrialSession[];
  }; // TODO: ADD BETTER TYPES
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judgeName: '',
    startDate: '',
  },
  judgeActivityReportData: {},
};
