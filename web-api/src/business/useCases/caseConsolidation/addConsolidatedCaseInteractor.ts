import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCasesByLeadDocketNumber } from '@web-api/persistence/postgres/cases/getCasesByLeadDocketNumber';
import {
  hashLockId,
  multiMutexLockWrapper,
} from '@web-api/persistence/postgres/utils/mutex';
import { settlePromises } from '@web-api/utilities/settlePromises';

/**
 * addConsolidatedCase
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number of the case to consolidate
 * @param {object} providers.docketNumberToConsolidateWith the docket number of the case with which to consolidate
 * @returns {object} the updated case data
 */
export const addConsolidatedCase = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    docketNumberToConsolidateWith,
  }: { docketNumber: string; docketNumberToConsolidateWith: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CONSOLIDATE_CASES)) {
    throw new UnauthorizedError('Unauthorized for case consolidation');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseToConsolidateWith = await getCaseByDocketNumber({
    applicationContext,
    docketNumber: docketNumberToConsolidateWith,
  });

  if (!caseToConsolidateWith) {
    throw new NotFoundError(
      `Case to consolidate with (${docketNumberToConsolidateWith}) was not found.`,
    );
  }

  let allCasesToConsolidate: Omit<RawCase, 'consolidatedCases'>[] = [];

  if (
    caseToUpdate.leadDocketNumber &&
    caseToUpdate.leadDocketNumber !== caseToConsolidateWith.leadDocketNumber
  ) {
    allCasesToConsolidate = await getCasesByLeadDocketNumber({
      leadDocketNumber: caseToUpdate.leadDocketNumber,
    });
  } else {
    allCasesToConsolidate = [caseToUpdate];
  }

  if (caseToConsolidateWith.leadDocketNumber) {
    const casesConsolidatedWithLeadCase = await getCasesByLeadDocketNumber({
      leadDocketNumber: caseToConsolidateWith.leadDocketNumber,
    });
    allCasesToConsolidate.push(...casesConsolidatedWithLeadCase);
  } else {
    allCasesToConsolidate.push(caseToConsolidateWith);
  }

  const newLeadCase = Case.findLeadCaseForCases(allCasesToConsolidate);

  const casesToUpdate = allCasesToConsolidate.filter(filterCaseToUpdate => {
    return filterCaseToUpdate.leadDocketNumber !== newLeadCase.docketNumber;
  });

  const updateCasePromises: Promise<RawCase>[] = [];
  casesToUpdate.forEach(caseInCasesToUpdate => {
    const caseEntity = new Case(caseInCasesToUpdate, {
      authorizedUser,
    });
    caseEntity.setLeadCase(newLeadCase.docketNumber);

    updateCasePromises.push(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        authorizedUser,
        caseToUpdate: caseEntity,
      }),
    );
  });

  await settlePromises(updateCasePromises);
};

// 10505: this replicates the existing functionality, but may need to account for `allCasesToConsolidate`?
export const addConsolidatedCaseInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    docketNumberToConsolidateWith,
  }: { docketNumber: string; docketNumberToConsolidateWith: string },
  authorizedUser: UnknownAuthUser,
) => {
  const lockIds = [docketNumber, docketNumberToConsolidateWith].map(
    docketNumber => hashLockId(`case|${docketNumber}`),
  );

  return multiMutexLockWrapper({
    lockIds,
    callback: () =>
      addConsolidatedCase(
        applicationContext,
        { docketNumber, docketNumberToConsolidateWith },
        authorizedUser,
      ),
  });
};

// export const determineEntitiesToLock = (
//   _applicationContext,
//   { docketNumber, docketNumberToConsolidateWith },
// ) => ({
//   identifiers: [docketNumber, docketNumberToConsolidateWith].map(
//     item => `case|${item}`,
//   ),
// });

// export const addConsolidatedCaseInteractor = withLocking(
//   addConsolidatedCase,
//   determineEntitiesToLock,
// );
