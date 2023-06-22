import { Case } from '../../entities/cases/Case';
import { CavAndSubmittedCaseTypes } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

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
  {
    judgesSelection,
    statuses,
  }: {
    judgesSelection: string[];
    statuses: CavAndSubmittedCaseTypes;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  /*
    TODO: ADD VALIDATION BEFORE PERSISTENCE CALL OF judgesSelection AND statuses
  */

  const totalSubmittedAndCavResults = (
    await Promise.all(
      judgesSelection.map(
        async judgeName =>
          await applicationContext
            .getPersistenceGateway()
            .getDocketNumbersByStatusAndByJudge({
              applicationContext,
              judgeName,
              statuses,
            }),
      ),
    )
  ).flat();

  const rawCaseRecords: RawCase[] = await Promise.all(
    totalSubmittedAndCavResults.map(async result => {
      return await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber: result.docketNumber,
        });
    }),
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

  return {
    cases: Case.validateRawCollection(filteredCaseRecords, {
      applicationContext,
    }),
    consolidatedCasesGroupCountMap: Object.fromEntries(
      consolidatedCasesGroupCountMap,
    ),
  };
};
