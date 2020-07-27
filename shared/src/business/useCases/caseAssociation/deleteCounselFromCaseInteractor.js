const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * deleteCounselFromCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case the user is attached to
 * @param {string} providers.userId the id of the user to be removed from the case
 * @returns {Promise} the promise of the update case call
 */
exports.deleteCounselFromCaseInteractor = async ({
  applicationContext,
  docketNumber,
  userId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const userToDelete = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (userToDelete.role === ROLES.privatePractitioner) {
    caseEntity.removePrivatePractitioner(userToDelete);
  } else if (userToDelete.role === ROLES.irsPractitioner) {
    caseEntity.removeIrsPractitioner(userToDelete);
  } else {
    throw new Error('User is not a practitioner');
  }

  await applicationContext.getPersistenceGateway().deleteUserFromCase({
    applicationContext,
    docketNumber,
    userId,
  });

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
