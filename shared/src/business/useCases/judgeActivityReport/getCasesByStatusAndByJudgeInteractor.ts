import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  InvalidRequest,
  UnauthorizedError,
} from '../../../../../web-api/src/errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';

export type JudgeActivityReportCavAndSubmittedCasesRequest = {
  statuses: string[];
  judges: string[];
  pageNumber?: number;
  pageSize?: number;
};

export type CavAndSubmittedCaseResponseType = {
  foundCases: { docketNumber: string }[];
};

export type CavAndSubmittedFilteredCasesType = {
  caseStatusHistory: {
    date: string;
    changedBy: string;
    updatedCaseStatus: string;
  }[];
  caseCaption: string;
  daysElapsedSinceLastStatusChange: number;
  docketNumber: string;
  leadDocketNumber?: string;
  formattedCaseCount: number;
  petitioners: TPetitioner[];
  status: string;
};

export const getCasesByStatusAndByJudgeInteractor = async (
  applicationContext: IApplicationContext,
  params: JudgeActivityReportCavAndSubmittedCasesRequest,
): Promise<{
  cases: CavAndSubmittedFilteredCasesType[];
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

  // get all of the cases
  const caseRecords: RawCaseWithWorksheet[] = await getCases(
    applicationContext,
    searchEntity,
  );

  const daysElapsedSinceLastStatusChange: number[] = caseRecords.map(
    caseRecord => calculateDaysElapsed(applicationContext, caseRecord),
  );

  const numConsolidatedCases: number[] = await Promise.all(
    caseRecords.map(caseRecord =>
      calculateNumberOfConsolidatedCases(applicationContext, caseRecord),
    ),
  );

  const finalListOfCases: CavAndSubmittedFilteredCasesType[] = caseRecords.map(
    (caseRecord, i) => ({
      ...caseRecord,
      daysElapsedSinceLastStatusChange: daysElapsedSinceLastStatusChange[i],
      formattedCaseCount: numConsolidatedCases[i],
    }),
  );

  finalListOfCases.sort((a, b) => {
    return (
      b.daysElapsedSinceLastStatusChange - a.daysElapsedSinceLastStatusChange
    );
  });

  const itemOffset =
    (searchEntity.pageNumber * searchEntity.pageSize) % finalListOfCases.length;

  const endOffset = itemOffset + searchEntity.pageSize;

  const formattedCaseRecordsForDisplay = finalListOfCases.slice(
    itemOffset,
    endOffset,
  );

  return {
    cases: formattedCaseRecordsForDisplay,
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

type RawCaseWithWorksheet = RawCase & {
  caseWorksheet: RawCaseWorksheet;
};

const getCases = async (
  applicationContext: IApplicationContext,
  searchEntity: JudgeActivityReportSearch,
): Promise<RawCaseWithWorksheet[]> => {
  // first get all cases for the specified judges and statuses
  const allCaseRecords = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: {
        excludeMemberCases: true,
        judges: searchEntity.judges,
        statuses: searchEntity.statuses,
      },
    });

  // filter out cases with decision documents
  const docketNumbersFilterOut = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersWithServedEventCodes(applicationContext, {
      cases: allCaseRecords,
      eventCodes: ['ODD', 'DEC', 'OAD', 'SDEC'],
    });

  const filteredCaseRecords = allCaseRecords.filter(
    caseInfo =>
      !docketNumbersFilterOut.includes(caseInfo.docketNumber) &&
      caseInfo.caseStatusHistory,
  );

  const completeCaseRecords = await Promise.all(
    filteredCaseRecords.map(async caseRecord => {
      const caseWorksheet = await applicationContext
        .getPersistenceGateway()
        .getCaseWorksheet({
          applicationContext,
          docketNumber: caseRecord.docketNumber,
        });

      return {
        ...caseRecord,
        caseWorksheet,
      } as unknown as RawCaseWithWorksheet;
    }),
  );

  return completeCaseRecords;
};

const calculateNumberOfConsolidatedCases = async (
  applicationContext: IApplicationContext,
  caseInfo: RawCase,
): Promise<number> => {
  if (!caseInfo.leadDocketNumber) {
    return 0;
  }

  return await applicationContext
    .getPersistenceGateway()
    .getCountOfConsolidatedCases({
      applicationContext,
      leadDocketNumber: caseInfo.leadDocketNumber,
    });
};
