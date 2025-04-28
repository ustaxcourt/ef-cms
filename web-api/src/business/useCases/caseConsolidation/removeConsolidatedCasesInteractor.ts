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

/**
 * removeConsolidatedCases
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number of the case to consolidate
 * @param {Array} providers.docketNumbersToRemove the docket numbers of the cases to remove from consolidation
 * @returns {object} the updated case data
 */
export const removeConsolidatedCases = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    docketNumbersToRemove,
  }: { docketNumber: string; docketNumbersToRemove: string[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CONSOLIDATE_CASES)) {
    throw new UnauthorizedError('Unauthorized for case consolidation');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  if (!caseToUpdate || !caseToUpdate?.leadDocketNumber) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const updateCasePromises: Promise<any>[] = [];

  const { leadDocketNumber } = caseToUpdate;

  const allConsolidatedCases = await getCasesByLeadDocketNumber({
    applicationContext,
    leadDocketNumber,
  });

  const newConsolidatedCases = allConsolidatedCases.filter(
    consolidatedCase =>
      !docketNumbersToRemove.includes(consolidatedCase.docketNumber),
  );

  if (
    docketNumbersToRemove.includes(leadDocketNumber) &&
    newConsolidatedCases.length > 1
  ) {
    const newLeadCase = Case.findLeadCaseForCases(newConsolidatedCases);

    for (const newConsolidatedCaseToUpdate of newConsolidatedCases) {
      const caseEntity = new Case(newConsolidatedCaseToUpdate, {
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
    }
  } else if (newConsolidatedCases.length == 1) {
    // a case cannot be consolidated with itself
    const caseEntity = new Case(newConsolidatedCases[0], {
      authorizedUser,
    });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        authorizedUser,
        caseToUpdate: caseEntity,
      }),
    );
  }

  for (const docketNumberToRemove of docketNumbersToRemove) {
    const caseToRemove = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: docketNumberToRemove,
    });

    if (!caseToRemove) {
      throw new NotFoundError(
        `Case to consolidate with (${docketNumberToRemove}) was not found.`,
      );
    }

    const caseEntity = new Case(caseToRemove, { authorizedUser });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        authorizedUser,
        caseToUpdate: caseEntity,
      }),
    );
  }

  await Promise.all(updateCasePromises);
};

export const removeConsolidatedCasesInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    docketNumbersToRemove,
  }: { docketNumber: string; docketNumbersToRemove: string[] },
  authorizedUser: UnknownAuthUser,
) => {
  const lockIds = [docketNumber, ...docketNumbersToRemove].map(docketNum =>
    hashLockId(`case|${docketNum}`),
  );

  return multiMutexLockWrapper({
    lockIds,
    callback: () =>
      removeConsolidatedCases(
        applicationContext,
        { docketNumber, docketNumbersToRemove },
        authorizedUser,
      ),
  });
};

// const determineEntitiesToLock = (
//   _applicationContext,
//   { docketNumber, docketNumbersToRemove = [] },
// ) => {
//   const docketNumbers = [docketNumber, ...docketNumbersToRemove].map(
//     item => `case|${item}`,
//   );

//   return {
//     identifiers: docketNumbers,
//   };
// };

// export const removeConsolidatedCasesInteractor = withLocking(
//   removeConsolidatedCases,
//   determineEntitiesToLock,
// );
