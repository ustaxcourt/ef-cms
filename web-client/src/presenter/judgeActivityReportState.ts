export type JudgeAcitivityReportFilters = {
  endDate: string;
  startDate: string;
  judgeName: string;
};

export type JudgeActivityReportState = {
  filters: JudgeAcitivityReportFilters;
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judgeName: '',
    startDate: '',
  },
};
