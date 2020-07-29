const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 * addConsolidatedCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the case to consolidate
 * @param {object} providers.docketNumberToConsolidateWith the docket number of the case with which to consolidate
 * @returns {object} the updated case data
 */
exports.addConsolidatedCaseInteractor = async ({
  applicationContext,
  docketNumber,
  docketNumberToConsolidateWith,
}) => {
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

  let allCasesToConsolidate = [];

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

  const updateCasePromises = [];
  casesToUpdate.forEach(caseToUpdate => {
    const caseEntity = new Case(caseToUpdate, { applicationContext });
    caseEntity.setLeadCase(newLeadCase.docketNumber);

    updateCasePromises.push(
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
    );
  });

  await Promise.all(updateCasePromises);
};
