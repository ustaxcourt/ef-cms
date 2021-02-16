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
 * @param {object} user the user to get
 * @returns {User} the retrieved user
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
  let updatedContact = false;
  if (contactPrimary && contactPrimary.name === name) {
    contactPrimary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
    contactPrimary.email = email;
    updatedContact = true;
  }

  const { contactSecondary } = caseEntity;
  if (contactSecondary && contactSecondary.name === name) {
    contactSecondary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
    contactSecondary.email = email;
    updatedContact = true;
  }

  if (!updatedContact) {
    throw new Error(
      `no contact primary or secondary found with that user name of ${name}`,
    );
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
