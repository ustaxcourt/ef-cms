const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

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

  await applicationContext.getPersistenceGateway().createNewPetitionerUser({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });

  return caseEntity;
};
