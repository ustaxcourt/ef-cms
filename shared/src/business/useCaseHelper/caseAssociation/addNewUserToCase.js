const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');
const { UserCase } = require('../../entities/UserCase');

/**
 * addNewUserToCase
 *
 * @param {object} options.caseEntity the case entity to modify and return
 * @param {string} options.email the email address for the user we are attaching to the case
 * @param {string} options.name the name of the user to update the case with
 * @returns {Case} the updated case entity
 */
exports.addNewUserToCase = async ({
  applicationContext,
  caseEntity,
  email,
  name,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }
  const { contactPrimary } = caseEntity;

  const userEntity = new User(
    {
      contact: contactPrimary,
      email,
      name,
      role: ROLES.petitioner,
      userId: applicationContext.getUniqueId(),
    },
    { applicationContext },
  );

  const {
    userId,
  } = await applicationContext.getPersistenceGateway().createUser({
    applicationContext,
    disableCognitoUser: false,
    user: userEntity.validate().toRawObject(),
  });

  contactPrimary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_PAPER;
  contactPrimary.email = email;
  contactPrimary.contactId = userId;

  const rawCase = caseEntity.toRawObject();
  const userCaseEntity = new UserCase(rawCase);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber: rawCase.docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId,
  });

  return caseEntity.validate();
};
