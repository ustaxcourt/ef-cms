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
  judgeNameToDisplayForHeader?: string;
};

export type JudgeActivityReportCavAndSubmittedCasesRequest = {
  statuses: string[];
  judges: string[];
  pageNumber?: number;
  pageSize?: number;
};

export type CavAndSubmittedCaseResponseType = {
  foundCases: { docketNumber: string }[];
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

export type OrdersAndOpinionResultCountTypes = {
  count: number;
  documentType: string | undefined;
  eventCode: string;
};

export type OpinionsReturnType = {
  aggregations: OrdersAndOpinionResultCountTypes[];
  total: number | undefined;
};

export type OrdersReturnType = {
  aggregations: OrdersAndOpinionResultCountTypes[];
  total: number | undefined;
};

export type CasesClosedReturnType = {
  results: CasesClosedType;
  closedCasesTotal: number | undefined;
};

export type TrialSessionReturnType = {
  results: TrialSessionTypes;
  trialSessionsHeldTotal: number;
};

export type ConsolidatedCasesGroupCountMapResponseType = {
  [leadDocketNumber: string]: number;
};

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
