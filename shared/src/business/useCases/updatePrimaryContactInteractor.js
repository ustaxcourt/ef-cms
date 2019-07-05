const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updatePrimaryContactInteractor
 *
 * @param caseToUpdate
 * @param applicationContext
 * @returns {*}
 */
exports.updatePrimaryContactInteractor = async ({
  applicationContext,
  caseToUpdate,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseEntity = new Case(caseToUpdate);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.toRawObject(),
  });

  return caseToUpdate;
};
