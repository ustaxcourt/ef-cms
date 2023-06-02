export type JudgeAcitivityReportFilters = {
  endDate: string;
  startDate: string;
  judgeName: string;
};

export type JudgeActivityReportState = {
  filters: JudgeAcitivityReportFilters;
  judgeActivityReportData: any; // TODO: ADD BETTER TYPES
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judgeName: '',
    startDate: '',
  },
  judgeActivityReportData: {},
};
