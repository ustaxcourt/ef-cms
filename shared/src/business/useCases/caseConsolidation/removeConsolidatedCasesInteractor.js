const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 * removeConsolidatedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseId the id of the case to consolidate
 * @param {Array} providers.caseIdsToRemove the case ids of the cases to remove from consolidation
 * @returns {object} the updated case data
 */
exports.removeConsolidatedCasesInteractor = async ({
  applicationContext,
  caseId,
  caseIdsToRemove,
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

  const updateCasePromises = [];

  const { leadCaseId } = caseToUpdate;

  const allConsolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadCaseId({
      applicationContext,
      leadCaseId,
    });

  const newConsolidatedCases = allConsolidatedCases.filter(
    consolidatedCase => !caseIdsToRemove.includes(consolidatedCase.caseId),
  );

  if (caseIdsToRemove.includes(leadCaseId) && newConsolidatedCases.length > 1) {
    const newLeadCase = Case.findLeadCaseForCases(newConsolidatedCases);

    for (let caseToUpdate of newConsolidatedCases) {
      const caseEntity = new Case(caseToUpdate, { applicationContext });
      caseEntity.setLeadCase(newLeadCase.caseId);

      updateCasePromises.push(
        applicationContext.getPersistenceGateway().updateCase({
          applicationContext,
          caseToUpdate: caseEntity.validate().toRawObject(),
        }),
      );
    }
  } else if (newConsolidatedCases.length <= 1) {
    const caseEntity = new Case(newConsolidatedCases[0], {
      applicationContext,
    });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
    );
  }

  for (let caseIdToRemove of caseIdsToRemove) {
    const caseToRemove = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({ applicationContext, caseId: caseIdToRemove });

    if (!caseToRemove) {
      throw new NotFoundError(
        `Case to consolidate with (${caseIdToRemove}) was not found.`,
      );
    }

    const caseEntity = new Case(caseToRemove, { applicationContext });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
    );
  }

  await Promise.all(updateCasePromises);
};
