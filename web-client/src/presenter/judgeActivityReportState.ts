import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';

export type JudgeActivityReportFilters = {
  endDate: string;
  startDate: string;
  judgeName?: string;
  judgeId?: string;
};

export type JudgeActivityReportCavAndSubmittedCasesRequestType = {
  statuses: string[];
  judgeName: string;
  searchAfter: {
    docketNumber: number;
  };
  pageSize: number;
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

export type consolidatedCasesGroupCountMapResponseType = {
  [leadDocketNumber: string]: number;
};

export type CavAndSubmittedCaseResponseType = {
  foundCases: { docketNumber: string }[];
  lastIdOfPage: { docketNumber: number };
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
  lastIdsOfPages: {
    docketNumber: number;
  }[];
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judgeName: '',
    startDate: '',
  },
  judgeActivityReportData: {},
  lastIdsOfPages: [{ docketNumber: 0 }],
};
