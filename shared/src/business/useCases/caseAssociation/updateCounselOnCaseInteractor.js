const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Practitioner } = require('../../entities/Practitioner');
const { Respondent } = require('../../entities/Respondent');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * updateCounselOnCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case the user is attached to
 * @param {object} providers.userData the data being updated on the user
 * @param {string} providers.userIdToUpdate the id of the user to be updated on the case
 * @returns {Promise} the promise of the update case call
 */
exports.updateCounselOnCaseInteractor = async ({
  applicationContext,
  caseId,
  userData,
  userIdToUpdate,
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

  const userToUpdate = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: userIdToUpdate,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (userToUpdate.role === User.ROLES.practitioner) {
    caseEntity.updatePractitioner(
      new Practitioner({ userId: userToUpdate.userId, ...userData }),
    );
  } else if (userToUpdate.role === User.ROLES.respondent) {
    caseEntity.updateRespondent(
      new Respondent({ userId: userToUpdate.userId, ...userData }),
    );
  } else {
    throw new Error('User is not a practitioner or respondent');
  }

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
