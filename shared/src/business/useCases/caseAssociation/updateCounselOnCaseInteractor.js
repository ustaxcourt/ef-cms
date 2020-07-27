const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateCounselOnCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case the user is attached to
 * @param {object} providers.userData the data being updated on the user
 * @param {string} providers.userId the id of the user to be updated on the case
 * @returns {Promise} the promise of the update case call
 */
exports.updateCounselOnCaseInteractor = async ({
  applicationContext,
  docketNumber,
  userData,
  userId,
}) => {
  const user = applicationContext.getCurrentUser();

  const editableFields = {
    representingPrimary: userData.representingPrimary,
    representingSecondary: userData.representingSecondary,
    serviceIndicator: userData.serviceIndicator,
  };

  if (!isAuthorized(user, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const userToUpdate = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (userToUpdate.role === ROLES.privatePractitioner) {
    caseEntity.updatePrivatePractitioner({
      userId,
      ...editableFields,
    });
  } else if (userToUpdate.role === ROLES.irsPractitioner) {
    caseEntity.updateIrsPractitioner({
      userId,
      ...editableFields,
    });
  } else {
    throw new Error('User is not a practitioner');
  }

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
