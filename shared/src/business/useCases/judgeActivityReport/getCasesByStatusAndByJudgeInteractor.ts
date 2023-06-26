import { Case } from '../../entities/cases/Case';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportCaseStatusSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearchCaseStatusSearch';
import { JudgeActivityReportCavAndSubmittedCasesRequestType } from '../../../../../web-client/src/presenter/judgeActivityReportState';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

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

/**
 * getCasesByStatusAndByJudgeInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.judgeName the name of the judge
 * @param {array} providers.statuses statuses of cases for judge activity
 * @returns {object} errors (null if no errors)
 */
export const getCasesByStatusAndByJudgeInteractor = async (
  applicationContext,
  {
    judgeName,
    pageSize,
    searchAfter,
    statuses,
  }: JudgeActivityReportCavAndSubmittedCasesRequestType,
): Promise<{
  cases: RawCase[];
  consolidatedCasesGroupCountMap: any;
  lastDocketNumberForCavAndSubmittedCasesSearch: number;
}> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportCaseStatusSearch({
    judgeName,
    statuses,
  });

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
        judgeName: searchEntity.judgeName,
        searchAfter,
        size: pageSize,
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

  const resetPaginationInfo =
    filteredCaseRecords.length === 0
      ? 0
      : lastDocketNumberForCavAndSubmittedCasesSearch;

  return {
    cases: Case.validateRawCollection(filteredCaseRecords, {
      applicationContext,
    }),
    consolidatedCasesGroupCountMap: Object.fromEntries(
      consolidatedCasesGroupCountMap,
    ),
    lastDocketNumberForCavAndSubmittedCasesSearch: resetPaginationInfo,
  };
};
