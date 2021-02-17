const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { UserCase } = require('../../entities/UserCase');

/**
 * addExistingUserToCaseInteractor
 *
 * @param {object} options.docketNumber the docket number for the case we need to update
 * @param {object} email the email address for the user we are attaching to the case
 * @param {object} name the name of the user to update the case with
 * @returns {Case} the updated case
 */
exports.addExistingUserToCaseInteractor = async ({
  applicationContext,
  caseEntity,
  email,
  name,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const userToAdd = await applicationContext
    .getPersistenceGateway()
    .getUserByEmail({
      applicationContext,
      email,
    });

  if (!userToAdd) {
    throw new Error(`no user found with the provided email of ${email}`);
  }

  const { contactPrimary } = caseEntity;
  if (contactPrimary.name === name) {
    contactPrimary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
    contactPrimary.email = email;
  } else {
    throw new Error(`no contact primary found with that user name of ${name}`);
  }

  const rawCase = caseEntity.toRawObject();
  const userCaseEntity = new UserCase(rawCase);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber: rawCase.docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId: userToAdd.userId,
  });

  return caseEntity.validate();
};
