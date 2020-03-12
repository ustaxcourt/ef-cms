const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * deleteCounselFromCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case the user is attached to
 * @param {string} providers.userIdToDelete the id of the user to be removed from the case
 * @returns {Promise} the promise of the update case call
 */
exports.deleteCounselFromCaseInteractor = async ({
  applicationContext,
  caseId,
  userIdToDelete,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const userToDelete = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: userIdToDelete,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (userToDelete.role === User.ROLES.privatePractitioner) {
    caseEntity.removePrivatePractitioner(userToDelete);
  } else if (userToDelete.role === User.ROLES.irsPractitioner) {
    caseEntity.removeIrsPractitioner(userToDelete);
  } else {
    throw new Error('User is not a practitioner');
  }

  await applicationContext.getPersistenceGateway().deleteUserFromCase({
    applicationContext,
    caseId,
    userId: userIdToDelete,
  });

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
