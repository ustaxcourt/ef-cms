const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * addConsolidatedCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseId the id of the case to consolidate
 * @param {object} providers.caseIdToConsolidateWith the id of the case with which to consolidate
 * @returns {object} the updated case data
 */
exports.addConsolidatedCaseInteractor = async ({
  applicationContext,
  caseId,
  caseIdToConsolidateWith,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CONSOLIDATE_CASES)) {
    throw new UnauthorizedError('Unauthorized for case consolidation');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseToConsolidateWith = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId: caseIdToConsolidateWith });

  if (!caseToConsolidateWith) {
    throw new NotFoundError(
      `Case to consolidte with (${caseIdToConsolidateWith}) was not found.`,
    );
  }

  let newLeadCase;
  let casesToUpdate = [caseToUpdate];

  if (caseToConsolidateWith.leadCaseId) {
    let allConsolidatedCases = [];
    allConsolidatedCases = applicationContext
      .getPersistenceGateway()
      .getCasesByLeadCaseId(caseToConsolidateWith.leadCaseId);
    newLeadCase = Case.findLeadCaseForCases([
      ...allConsolidatedCases,
      caseToUpdate,
    ]);

    if (newLeadCase.caseId !== caseToConsolidateWith.caseId) {
      casesToUpdate = casesToUpdate.concat(allConsolidatedCases);
    }
  } else {
    newLeadCase = Case.findLeadCaseForCases([
      caseToConsolidateWith,
      caseToUpdate,
    ]);

    casesToUpdate.push(caseToConsolidateWith);
  }

  const updateCasePromises = [];
  casesToUpdate.forEach(caseToUpdate => {
    const caseEntity = new Case(caseToUpdate, { applicationContext });
    caseEntity.setLeadCase(newLeadCase.caseId);

    updateCasePromises.push(
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
    );
  });

  return await Promise.all(updateCasePromises);
};
