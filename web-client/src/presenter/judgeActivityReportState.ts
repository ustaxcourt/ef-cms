import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';

export type JudgeActivityReportFilters = {
  endDate: string;
  startDate: string;
  judgesSelection: string[];
  judgeName: string;
};

export type JudgeActivityReportRequestType = Omit<
  JudgeActivityReportFilters,
  'judgeName'
>;

export type CasesClosedType = {
  [CASE_STATUS_TYPES.closed]: number;
  [CASE_STATUS_TYPES.closedDismissed]: number;
};

export type TrialSessionTypes = {
  [SESSION_TYPES.regular]: number;
  [SESSION_TYPES.small]: number;
  [SESSION_TYPES.hybrid]: number;
  [SESSION_TYPES.special]: number;
  [SESSION_TYPES.motionHearing]: number;
};

export type OrdersAndOpinionTypes = {
  count: number;
  documentType: string | undefined;
  eventCode: string;
};

export type consolidatedCasesGroupCountMapResponseType = {
  [leadDocketNumber: string]: number;
};

export type JudgeActivityReportState = {
  filters: JudgeActivityReportFilters;
  judgeActivityReportData: {
    trialSessions?: TrialSessionTypes;
    casesClosedByJudge?: CasesClosedType;
    consolidatedCasesGroupCountMap?: consolidatedCasesGroupCountMapResponseType;
    opinions?: OrdersAndOpinionTypes[];
    orders?: OrdersAndOpinionTypes[];
    submittedAndCavCasesByJudge?: RawCase[];
  };
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judgeName: '',
    judgesSelection: [],
    startDate: '',
  },
  judgeActivityReportData: {},
};
