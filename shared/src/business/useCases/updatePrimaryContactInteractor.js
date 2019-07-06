const {
  isAuthorized,
  UPDATE_CONTACT_PRIMARY,
} = require('../../authorization/authorizationClientService');
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

  if (!isAuthorized(user, UPDATE_CONTACT_PRIMARY)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  caseToUpdate.contactPrimary = contactInfo;

  const caseEntity = new Case(caseToUpdate);

  // validation?

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.toRawObject(),
  });

  return caseToUpdate;
};
