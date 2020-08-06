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
 * @param {object} providers.docketNumber the docket number of the case to consolidate
 * @param {Array} providers.docketNumbersToRemove the docket numbers of the cases to remove from consolidation
 * @returns {object} the updated case data
 */
exports.removeConsolidatedCasesInteractor = async ({
  applicationContext,
  docketNumber,
  docketNumbersToRemove,
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

  const updateCasePromises = [];

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

    for (let caseToUpdate of newConsolidatedCases) {
      const caseEntity = new Case(caseToUpdate, { applicationContext });
      caseEntity.setLeadCase(newLeadCase.docketNumber);

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
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
    );
  }

  await Promise.all(updateCasePromises);
};
