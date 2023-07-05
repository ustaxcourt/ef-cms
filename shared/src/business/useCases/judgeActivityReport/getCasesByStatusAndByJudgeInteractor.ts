import { CAV_AND_SUBMITTED_CASES_PAGE_SIZE } from '../../entities/EntityConstants';
import {
  ConsolidatedCasesGroupCountMapResponseType,
  JudgeActivityReportCavAndSubmittedCasesRequest,
} from '../../../../../web-client/src/presenter/judgeActivityReportState';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

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

const hasUnwantedDocketEntryEventCode = docketEntries => {
  const prohibitedDocketEntryEventCodes: string[] = [
    'ODD',
    'DEC',
    'OAD',
    'SDEC',
  ];

  return docketEntries.some(docketEntry => {
    if (docketEntry.servedAt && !docketEntry.isStricken) {
      return prohibitedDocketEntryEventCodes.includes(docketEntry.eventCode);
    }

    return false;
  });
};

const filterCasesWithUnwantedDocketEntryEventCodes = caseRecords => {
  const caseRecordsToReturn: Array<any> = [];

  caseRecords.forEach(individualCaseRecord => {
    if (!hasUnwantedDocketEntryEventCode(individualCaseRecord.docketEntries)) {
      caseRecordsToReturn.push(individualCaseRecord);
    }
  });

  return caseRecordsToReturn;
};

export const getCasesByStatusAndByJudgeInteractor = async (
  applicationContext,
  params: JudgeActivityReportCavAndSubmittedCasesRequest,
): Promise<{
  cases: CavAndSubmittedFilteredCasesType[];
  consolidatedCasesGroupCountMap: ConsolidatedCasesGroupCountMapResponseType;
  lastDocketNumberForCavAndSubmittedCasesSearch: number;
}> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  params.judges = params.judges || [];
  params.pageSize = params.pageSize || CAV_AND_SUBMITTED_CASES_PAGE_SIZE;
  params.searchAfter = params.searchAfter || 0;
  params.statuses = params.statuses || [];

  const searchEntity = new JudgeActivityReportSearch(params);
  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const {
    foundCases: submittedAndCavCasesResults,
    lastDocketNumberForCavAndSubmittedCasesSearch,
  } = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: {
        judges: searchEntity.judges,
        pageSize: searchEntity.pageSize,
        searchAfter: searchEntity.searchAfter,
        statuses: searchEntity.statuses,
      },
    });

  const rawCaseRecords: RawCase[] = await Promise.all(
    submittedAndCavCasesResults.map(
      async result =>
        await applicationContext.getPersistenceGateway().getCaseByDocketNumber({
          applicationContext,
          docketNumber: result.docketNumber,
        }),
    ),
  );

  // We need to filter out member cases returned from elasticsearch so we can get an accurate
  // consolidated cases group count even when the case status of a member case does not match
  // the lead case status.
  const rawCaseRecordsWithWithoutMemberCases: any = await Promise.all(
    rawCaseRecords
      .filter(
        rawCaseRecord =>
          !rawCaseRecord.leadDocketNumber ||
          rawCaseRecord.docketNumber === rawCaseRecord.leadDocketNumber,
      )
      .map(async rawCaseRecord => {
        if (rawCaseRecord.leadDocketNumber) {
          rawCaseRecord.consolidatedCases = await applicationContext
            .getPersistenceGateway()
            .getCasesByLeadDocketNumber({
              applicationContext,
              leadDocketNumber: rawCaseRecord.docketNumber,
            });
          return rawCaseRecord;
        } else {
          return rawCaseRecord;
        }
      }),
  );

  const filteredCaseRecords = filterCasesWithUnwantedDocketEntryEventCodes(
    rawCaseRecordsWithWithoutMemberCases,
  );

  const consolidatedCasesGroupCountMap = new Map();

  getConsolidatedCaseGroupCountMap(
    filteredCaseRecords,
    consolidatedCasesGroupCountMap,
  );

  const formattedCaseRecords: CavAndSubmittedFilteredCasesType[] =
    filteredCaseRecords.map(caseRecord => ({
      caseCaption: caseRecord.caseCaption,
      caseStatusHistory: caseRecord.caseStatusHistory || [],
      docketNumber: caseRecord.docketNumber,
      docketNumberWithSuffix: caseRecord.docketNumberWithSuffix,
      leadDocketNumber: caseRecord.leadDocketNumber,
      petitioners: caseRecord.petitioners,
      status: caseRecord.status,
    }));

  const paginationInfo = filteredCaseRecords.length
    ? lastDocketNumberForCavAndSubmittedCasesSearch
    : 0;

  return {
    cases: formattedCaseRecords,
    consolidatedCasesGroupCountMap: Object.fromEntries(
      consolidatedCasesGroupCountMap,
    ),
    lastDocketNumberForCavAndSubmittedCasesSearch: paginationInfo,
  };
};
