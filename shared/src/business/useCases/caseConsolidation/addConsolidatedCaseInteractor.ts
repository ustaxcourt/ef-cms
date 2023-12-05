import { Case } from '../../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

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
  applicationContext: IApplicationContext,
  {
    docketNumber,
    docketNumberToConsolidateWith,
  }: { docketNumber: string; docketNumberToConsolidateWith: string },
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

  const caseToConsolidateWith = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: docketNumberToConsolidateWith,
    });

  if (!caseToConsolidateWith) {
    throw new NotFoundError(
      `Case to consolidate with (${docketNumberToConsolidateWith}) was not found.`,
    );
  }

  let allCasesToConsolidate: RawCase[] = [];

  if (
    caseToUpdate.leadDocketNumber &&
    caseToUpdate.leadDocketNumber !== caseToConsolidateWith.leadDocketNumber
  ) {
    allCasesToConsolidate = await applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber({
        applicationContext,
        leadDocketNumber: caseToUpdate.leadDocketNumber,
      });
  } else {
    allCasesToConsolidate = [caseToUpdate];
  }

  if (caseToConsolidateWith.leadDocketNumber) {
    const casesConsolidatedWithLeadCase = await applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber({
        applicationContext,
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
    const caseEntity = new Case(caseInCasesToUpdate, { applicationContext });
    caseEntity.setLeadCase(newLeadCase.docketNumber);

    updateCasePromises.push(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate: caseEntity,
      }),
    );
  });

  await Promise.all(updateCasePromises);
};

export const determineEntitiesToLock = (
  _applicationContext,
  { docketNumber, docketNumberToConsolidateWith },
) => ({
  identifiers: [docketNumber, docketNumberToConsolidateWith].map(
    item => `case|${item}`,
  ),
});

export const addConsolidatedCaseInteractor = withLocking(
  addConsolidatedCase,
  determineEntitiesToLock,
);
