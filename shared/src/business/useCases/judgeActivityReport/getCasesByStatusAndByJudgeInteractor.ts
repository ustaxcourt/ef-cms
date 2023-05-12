import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

const hasUnwantedDocketEntryEventCode = docketEntries => {
  const prohibitedDocketEntryEventCodes = ['ODD', 'DEC', 'OAD', 'SDEC'];
  const boolResult = docketEntries.some(docketEntry =>
    prohibitedDocketEntryEventCodes.includes(docketEntry.eventCode),
  );
  console.log(
    `boolResult for ${docketEntries[0].docketNumber}::::`,
    boolResult,
  );
  return boolResult;
};

const filterCasesWithUnwantedDocketEntryEventCodes = caseRecords => {
  const caseRecordsToReturn = [];
  const consolidatedCaseGroupsToRemoveByLeadCase: string[] = [];

  caseRecords.forEach(individualCaseRecord => {
    if (
      !individualCaseRecord.leadDocketNumber &&
      hasUnwantedDocketEntryEventCode(individualCaseRecord.docketEntries)
    ) {
      return;
    } else if (
      !individualCaseRecord.leadDocketNumber &&
      !hasUnwantedDocketEntryEventCode(individualCaseRecord.docketEntries)
    ) {
      caseRecordsToReturn.push(individualCaseRecord);
    } else if (
      individualCaseRecord.docketNumber ===
        individualCaseRecord.leadDocketNumber &&
      hasUnwantedDocketEntryEventCode(individualCaseRecord.docketEntries)
    ) {
      consolidatedCaseGroupsToRemoveByLeadCase.push(
        individualCaseRecord.docketNumber,
      );
    } else {
      caseRecordsToReturn.push(individualCaseRecord);
    }
  });

  console.log('caseRecordsToReturn::::', caseRecordsToReturn);

  const filteredCaseRecords = caseRecordsToReturn.filter(
    individualCaseRecord =>
      !consolidatedCaseGroupsToRemoveByLeadCase.includes(
        individualCaseRecord.docketNumber,
      ),
  );

  return filteredCaseRecords;
};

/**
 * getCasesClosedByJudgeInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the date to end the search for judge activity
 * @param {string} providers.judgeName the name of the judge
 * @param {string} providers.startDate the date to start the search for judge activity
 * @param {array} providers.statuses statuses of cases for judge activity
 * @returns {object} errors (null if no errors)
 */
export const getCasesByStatusAndByJudgeInteractor = async (
  applicationContext,
  {
    judgeName,
    statuses,
  }: {
    judgeName: string;
    statuses: string[];
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const submittedAndCavCasesResults = await applicationContext
    .getPersistenceGateway()
    .getCasesByStatusAndByJudge({
      applicationContext,
      judgeName,
      statuses,
    });

  const rawCaseRecords = await Promise.all(
    submittedAndCavCasesResults.map(async result => {
      return await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber: result.docketNumber,
        });
    }),
  );

  // const rawCaseRecordsWithConsolidatedCases = await Promise.all(
  //   rawCaseRecords.map(async rawCaseRecord => {
  //     const consolidatedCases
  //   }),
  // );
  // if in CCG loop over and
  //   - if lead case grab consolidated cases array
  //   - if member case filter out

  const filteredCaseRecords =
    filterCasesWithUnwantedDocketEntryEventCodes(rawCaseRecords);

  console.log('filteredCaseRecords::::', filteredCaseRecords);

  return Case.validateRawCollection(filteredCaseRecords, {
    applicationContext,
  });
};
