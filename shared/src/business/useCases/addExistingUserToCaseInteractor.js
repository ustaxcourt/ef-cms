const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { SERVICE_INDICATOR_TYPES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');
const { UserCase } = require('../entities/UserCase');

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
  docketNumber,
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

  const caseToAttachUser = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToAttachUser, { applicationContext });
  const { contactPrimary } = caseEntity;
  if (contactPrimary.name === name) {
    contactPrimary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
    contactPrimary.email = email;
  } else {
    throw new Error(`no contact primary found with that user name of ${name}`);
  }

  const userCaseEntity = new UserCase(caseToAttachUser);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId: userToAdd.userId,
  });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.validate().toRawObject();
};
