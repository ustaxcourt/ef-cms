import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

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
  _applicationContext: ServerApplicationContext,
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
    docketNumber,
  });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseToConsolidateWith = await getCaseByDocketNumber({
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
    allCasesToConsolidate = await getConsolidatedCases({
      leadDocketNumber: caseToUpdate.leadDocketNumber,
    });
  } else {
    allCasesToConsolidate = [caseToUpdate];
  }

  if (caseToConsolidateWith.leadDocketNumber) {
    const casesConsolidatedWithLeadCase = await getConsolidatedCases({
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
      updateCaseAndAssociations({
        authorizedUser,
        caseToUpdate: caseEntity,
      }),
    );
  });

  await settlePromises(updateCasePromises);
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
