import { Case } from '../../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

/**
 * addConsolidatedCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number of the case to consolidate
 * @param {object} providers.docketNumberToConsolidateWith the docket number of the case with which to consolidate
 * @returns {object} the updated case data
 */
export const addConsolidatedCaseInteractor = async (
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

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  if (!caseRecord) {
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

  let allCasesToConsolidate = [];

  if (
    caseRecord.leadDocketNumber &&
    caseRecord.leadDocketNumber !== caseToConsolidateWith.leadDocketNumber
  ) {
    allCasesToConsolidate = await applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber({
        applicationContext,
        leadDocketNumber: caseRecord.leadDocketNumber,
      });
  } else {
    allCasesToConsolidate = [caseRecord];
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

  const updateCasePromises = [];
  casesToUpdate.forEach(caseInCasesToUpdate => {
    const oldCaseCopy = applicationContext
      .getUtilities()
      .cloneAndFreeze(caseInCasesToUpdate);

    const caseEntity = new Case(caseInCasesToUpdate, { applicationContext });
    caseEntity.setLeadCase(newLeadCase.docketNumber);

    updateCasePromises.push(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        newCase: caseEntity,
        oldCaseCopy,
      }),
    );
  });

  await Promise.all(updateCasePromises);
};
