import { FORMATS } from '@shared/business/utilities/DateHandler';
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
    throw new InvalidRequest('Invalid search terms');
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

  const docketNumbersFilterOut = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersWithServedEventCodes(applicationContext, {
      cases: cavAndSubmittedCases,
      eventCodes: prohibitedDocketEntries,
    });

  const finalListOfCases = await Promise.all(
    cavAndSubmittedCases
      .filter(
        caseInfo =>
          !docketNumbersFilterOut.includes(caseInfo.docketNumber) &&
          caseInfo.caseStatusHistory,
      )
      .map(async caseInfo => {
        if (caseInfo.leadDocketNumber) {
          caseInfo.consolidatedCases = await applicationContext
            .getPersistenceGateway()
            .getCasesMetadataByLeadDocketNumber({
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

  for (const eachCase of finalListOfCases) {
    const daysElapsed = calculateDaysElapsed(applicationContext, eachCase);
    eachCase.daysElapsedSinceLastStatusChange = daysElapsed;
  }

  finalListOfCases.sort((a, b) => {
    return (
      b.daysElapsedSinceLastStatusChange - a.daysElapsedSinceLastStatusChange
    );
  });

  const itemOffset =
    (searchEntity.pageNumber * searchEntity.pageSize) % finalListOfCases.length;

  const endOffset = itemOffset + searchEntity.pageSize;

  const formattedCaseRecordsForDisplay = finalListOfCases
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ consolidatedCases, ...rest }) => rest)
    .slice(itemOffset, endOffset);

  return {
    cases: formattedCaseRecordsForDisplay,
    consolidatedCasesGroupCountMap: Object.fromEntries(
      consolidatedCasesGroupCountMap,
    ),
    totalCount: finalListOfCases.length,
  };
};

const calculateDaysElapsed = (
  applicationContext: IApplicationContext,
  individualCase: RawCase,
) => {
  const currentDateInIsoFormat: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      FORMATS.ISO,
    );

  individualCase.caseStatusHistory.sort((a, b) => a.date - b.date);

  const newestCaseStatusChangeIndex =
    individualCase.caseStatusHistory.length - 1;

  const dateOfLastCaseStatusChange =
    individualCase.caseStatusHistory[newestCaseStatusChangeIndex].date;

  return applicationContext
    .getUtilities()
    .calculateDifferenceInDays(
      currentDateInIsoFormat,
      dateOfLastCaseStatusChange,
    );
};
