import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';

export type JudgeActivityReportFilters = {
  endDate: string;
  startDate: string;
  judgeName?: string;
  judgeId?: string;
  judges?: string[];
};

export type JudgeActivityReportCasesClosedRequest = Pick<
  JudgeActivityReportFilters,
  'endDate' | 'startDate' | 'judges'
> & {
  pageSize: number;
};

export type JudgeActivityReportCavAndSubmittedCasesRequest = {
  statuses: string[];
  searchAfter: number;
  pageSize: number;
  judges: string[];
};

export type CavAndSubmittedCaseResponseType = {
  foundCases: { docketNumber: string }[];
  lastDocketNumberForCavAndSubmittedCasesSearch: number;
};

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

export type ConsolidatedCasesGroupCountMapResponseType = {
  [leadDocketNumber: string]: number;
};

export type JudgeActivityReportState = {
  filters: JudgeActivityReportFilters;
  judgeActivityReportData: {
    trialSessions?: TrialSessionTypes;
    casesClosedByJudge?: CasesClosedType;
    consolidatedCasesGroupCountMap?: ConsolidatedCasesGroupCountMapResponseType;
    opinions?: OrdersAndOpinionTypes[];
    orders?: OrdersAndOpinionTypes[];
    submittedAndCavCasesByJudge?: RawCase[];
  };
  lastIdsOfPages: number[];
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judgeName: '',
    judges: [],
    startDate: '',
  },
  judgeActivityReportData: {},
  lastIdsOfPages: [0],
};
