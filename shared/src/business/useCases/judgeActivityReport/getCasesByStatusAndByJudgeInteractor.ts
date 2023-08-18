import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

export type JudgeActivityReportCavAndSubmittedCasesRequest = {
  statuses: string[];
  judges: string[];
  pageNumber?: number;
  pageSize?: number;
};

export type CavAndSubmittedCaseResponseType = {
  foundCases: { docketNumber: string }[];
};

export type ConsolidatedCasesGroupCountMapResponseType = {
  [leadDocketNumber: string]: number;
};

export type CavAndSubmittedFilteredCasesType = {
  caseStatusHistory: {
    date: string;
    changedBy: string;
    updatedCaseStatus: string;
  }[];
  leadDocketNumber: string;
  docketNumber: string;
  caseCaption: string;
  status: string;
  petitioners: TPetitioner[];
};

const getConsolidatedCaseGroupCountMap = (
  filteredCaseRecords,
  consolidatedCasesGroupCountMap,
) => {
  filteredCaseRecords.forEach(caseRecord => {
    if (caseRecord.leadDocketNumber) {
      consolidatedCasesGroupCountMap.set(
        caseRecord.leadDocketNumber,
        caseRecord.consolidatedCases.length,
      );
    }
  });
};

export const getCasesByStatusAndByJudgeInteractor = async (
  applicationContext,
  params: JudgeActivityReportCavAndSubmittedCasesRequest,
): Promise<{
  cases: CavAndSubmittedFilteredCasesType[];
  consolidatedCasesGroupCountMap: ConsolidatedCasesGroupCountMapResponseType;
  totalCount: number;
}> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);
  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const caseRecords = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: {
        judges: searchEntity.judges,
        statuses: searchEntity.statuses,
      },
    });

  const cavAndSubmittedCases = caseRecords.filter(
    caseInfo =>
      !caseInfo.leadDocketNumber ||
      caseInfo.docketNumber === caseInfo.leadDocketNumber,
  );

  const prohibitedDocketEntries = ['ODD', 'DEC', 'OAD', 'SDEC'];

  const casesToFilterOut = await applicationContext
    .getPersistenceGateway()
    .getCasesByEventCodes({
      applicationContext,
      params: {
        cases: cavAndSubmittedCases,
        eventCodes: prohibitedDocketEntries,
      },
    });

  const formatedCasesToFilterOut = casesToFilterOut.map(
    caseI => caseI.docketNumber,
  );

  const finalListOfCases = await Promise.all(
    cavAndSubmittedCases
      .filter(
        caseInfo =>
          !formatedCasesToFilterOut.includes(caseInfo.docketNumber) &&
          caseInfo.caseStatusHistory,
      )
      .map(async caseInfo => {
        if (caseInfo.leadDocketNumber) {
          caseInfo.consolidatedCases = await applicationContext
            .getPersistenceGateway()
            .getCasesByLeadDocketNumber({
              applicationContext,
              leadDocketNumber: caseInfo.docketNumber,
            });
          return caseInfo;
        } else {
          return caseInfo;
        }
      }),
  );

  const consolidatedCasesGroupCountMap = new Map();

  getConsolidatedCaseGroupCountMap(
    finalListOfCases,
    consolidatedCasesGroupCountMap,
  );

  const itemOffset =
    (searchEntity.pageNumber * searchEntity.pageSize) % finalListOfCases.length;

  const endOffset = itemOffset + searchEntity.pageSize;

  const formattedCaseRecordsForDisplay = finalListOfCases.slice(
    itemOffset,
    endOffset,
  );

  return {
    cases: formattedCaseRecordsForDisplay,
    consolidatedCasesGroupCountMap: Object.fromEntries(
      consolidatedCasesGroupCountMap,
    ),
    totalCount: finalListOfCases.length,
  };
};
