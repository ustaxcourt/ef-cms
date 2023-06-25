import {
  CASE_STATUS_TYPES,
  CAV_AND_SUBMITTED_CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';

export type JudgeActivityReportFilters = {
  endDate: string;
  startDate: string;
  judgeName?: string;
  judgeId?: string;
};

export type JudgeActivityReportCavAndSubmittedCasesRequestType = {
  statuses: CAV_AND_SUBMITTED_CASE_STATUS_TYPES;
  judgeName: string;
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

export type JudgeActivityReportState = {
  filters: JudgeActivityReportFilters;
  judgeActivityReportData: {
    trialSessions?: TrialSessionTypes;
    casesClosedByJudge?: CasesClosedType;
    consolidatedCasesGroupCountMap?: consolidatedCasesGroupCountMapResponseType;
    opinions?: OrdersAndOpinionTypes[];
    orders?: OrdersAndOpinionTypes[];
    submittedAndCavCasesByJudge?: RawCase[];
    lastIdsOfPages: {
      docketNumber: number;
    }[];
    totalCases: number;
  };
};

export const initialJudgeActivityReportState: JudgeActivityReportState = {
  filters: {
    endDate: '',
    judgeName: '',
    startDate: '',
  },
  judgeActivityReportData: {
    lastIdsOfPages: [{ docketNumber: 0 }],
    totalCases: 0,
  },
};
