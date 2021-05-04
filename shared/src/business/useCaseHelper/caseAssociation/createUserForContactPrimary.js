const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');
const { UserCase } = require('../../entities/UserCase');

/**
 * createUserForContactPrimary
 *
 * @param {object} options.caseEntity the case entity to modify and return
 * @param {string} options.email the email address for the user we are attaching to the case
 * @param {string} options.name the name of the user to update the case with
 * @returns {Case} the updated case entity
 */
exports.createUserForContactPrimary = async ({
  applicationContext,
  caseEntity,
  email,
  name,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const contactPrimary = caseEntity.getContactPrimary();

  const userEntity = new User(
    {
      contact: contactPrimary,
      hasEAccess: true,
      name,
      pendingEmail: email,
      role: ROLES.petitioner,
      userId: contactPrimary.contactId,
    },
    { applicationContext },
  );

  const userRaw = userEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().createNewPetitionerUser({
    applicationContext,
    user: userRaw,
  });

  const rawCase = caseEntity.toRawObject();
  const userCaseEntity = new UserCase(rawCase);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber: rawCase.docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId: userRaw.userId,
  });

  return caseEntity;
};
