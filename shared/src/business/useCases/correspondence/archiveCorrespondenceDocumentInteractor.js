const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * archiveCorrespondenceDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.correspondenceId case correspondence id
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {void}
 */
exports.archiveCorrespondenceDocumentInteractor = async (
  applicationContext,
  { correspondenceId, docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
    applicationContext,
    key: correspondenceId,
  });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const caseEntity = new Case(caseToUpdate, { applicationContext });
  const correspondenceToArchiveEntity = caseEntity.correspondence.find(
    c => c.correspondenceId === correspondenceId,
  );

  caseEntity.archiveCorrespondence(correspondenceToArchiveEntity);

  await applicationContext.getPersistenceGateway().updateCaseCorrespondence({
    applicationContext,
    correspondence: correspondenceToArchiveEntity.validate().toRawObject(),
    docketNumber,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });
};
