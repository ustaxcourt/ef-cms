const { Case } = require('../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * updatePrimaryContactInteractor
 *
 * @param caseToUpdate
 * @param applicationContext
 * @returns {*}
 */
exports.updatePrimaryContactInteractor = async ({
  applicationContext,
  caseId,
  contactInfo,
}) => {
  const user = applicationContext.getCurrentUser();

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (user.userId !== caseToUpdate.userId) {
    throw new UnauthorizedError('Unauthorized for update case contact');
  }

  caseToUpdate.contactPrimary = contactInfo;

  const updatedCase = new Case(caseToUpdate).validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: updatedCase,
  });

  return updatedCase;
};
