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
import { SubmittedCAVTableFields } from '@web-api/persistence/elasticsearch/getDocketNumbersByStatusAndByJudge';
import { isEmpty } from 'lodash';

export type JudgeActivityReportCavAndSubmittedCasesRequest = {
  statuses: string[];
  judges: string[];
  pageNumber?: number;
  pageSize?: number;
};

export type CavAndSubmittedFilteredCasesType = SubmittedCAVTableFields & {
  daysElapsedSinceLastStatusChange: number;
  formattedCaseCount: number;
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
  const caseRecords: SubmittedCAVTableDataWithWorksheet[] = await getCases(
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

  const allCaseResults: CavAndSubmittedFilteredCasesType[] = caseRecords.map(
    (caseRecord, i) => ({
      ...caseRecord,
      daysElapsedSinceLastStatusChange: daysElapsedSinceLastStatusChange[i],
      formattedCaseCount: numConsolidatedCases[i],
    }),
  );

  allCaseResults.sort((a, b) => {
    return (
      b.daysElapsedSinceLastStatusChange - a.daysElapsedSinceLastStatusChange
    );
  });

  let paginatedCaseResults;
  if (searchEntity.pageSize && searchEntity.pageNumber) {
    const itemOffset =
      (searchEntity.pageNumber * searchEntity.pageSize) % allCaseResults.length;

    const endOffset = itemOffset + searchEntity.pageSize;

    paginatedCaseResults = allCaseResults.slice(itemOffset, endOffset);
  }

  return {
    cases: paginatedCaseResults || allCaseResults,
    totalCount: allCaseResults.length,
  };
};

const calculateDaysElapsed = (
  applicationContext: IApplicationContext,
  individualCase: RawCase,
) => {
  if (isEmpty(individualCase.caseStatusHistory)) {
    return 0;
  }

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

type SubmittedCAVTableDataWithWorksheet = SubmittedCAVTableFields & {
  caseWorksheet: RawCaseWorksheet;
};

const getCases = async (
  applicationContext: IApplicationContext,
  searchEntity: JudgeActivityReportSearch,
): Promise<SubmittedCAVTableDataWithWorksheet[]> => {
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
      } as unknown as SubmittedCAVTableDataWithWorksheet;
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
