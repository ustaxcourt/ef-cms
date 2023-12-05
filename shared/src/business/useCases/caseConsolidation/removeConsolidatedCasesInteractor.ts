import { Case } from '../../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

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
  applicationContext: IApplicationContext,
  {
    docketNumber,
    docketNumbersToRemove,
  }: { docketNumber: string; docketNumbersToRemove: string[] },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CONSOLIDATE_CASES)) {
    throw new UnauthorizedError('Unauthorized for case consolidation');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const updateCasePromises: Promise<any>[] = [];

  const { leadDocketNumber } = caseToUpdate;

  const allConsolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
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

    for (let newConsolidatedCaseToUpdate of newConsolidatedCases) {
      const caseEntity = new Case(newConsolidatedCaseToUpdate, {
        applicationContext,
      });
      caseEntity.setLeadCase(newLeadCase.docketNumber);

      updateCasePromises.push(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          caseToUpdate: caseEntity,
        }),
      );
    }
  } else if (newConsolidatedCases.length == 1) {
    // a case cannot be consolidated with itself
    const caseEntity = new Case(newConsolidatedCases[0], {
      applicationContext,
    });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate: caseEntity,
      }),
    );
  }

  for (let docketNumberToRemove of docketNumbersToRemove) {
    const caseToRemove = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: docketNumberToRemove,
      });

    if (!caseToRemove) {
      throw new NotFoundError(
        `Case to consolidate with (${docketNumberToRemove}) was not found.`,
      );
    }

    const caseEntity = new Case(caseToRemove, { applicationContext });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate: caseEntity,
      }),
    );
  }

  await Promise.all(updateCasePromises);
};

const determineEntitiesToLock = (
  _applicationContext,
  { docketNumber, docketNumbersToRemove = [] },
) => {
  const docketNumbers = [docketNumber, ...docketNumbersToRemove].map(
    item => `case|${item}`,
  );

  return {
    identifiers: docketNumbers,
  };
};

export const removeConsolidatedCasesInteractor = withLocking(
  removeConsolidatedCases,
  determineEntitiesToLock,
);
