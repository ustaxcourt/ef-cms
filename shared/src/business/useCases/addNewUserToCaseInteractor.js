const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { ROLES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');
const { UserCase } = require('../entities/UserCase');
let generator = require('generate-password');

const getRandomTemporaryPassword = () => {
  return generator.generate({
    numbers: true,
    strict: true,
    symbols: true,
  });
};

/**
 * addNewUserToCaseInteractor
 *
 * @param {object} options.docketNumber the docket number for the case we need to update
 * @param {object} email the email address for the user we are attaching to the case
 * @param {object} name the name of the user to update the case with
 * @returns {Case} the updated case
 */
exports.addNewUserToCaseInteractor = async ({
  applicationContext,
  docketNumber,
  email,
  name,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const existingUser = await applicationContext
    .getPersistenceGateway()
    .getUserByEmail({
      applicationContext,
      email,
    });

  if (existingUser) {
    throw new Error(
      `A user was already found with that provided email of ${email}.  This interactor expects no user account to already exist`,
    );
  }

  const caseToAttachUser = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToAttachUser, { applicationContext });
  const { contactPrimary } = caseEntity;
  let updatedContact = null;
  if (contactPrimary && contactPrimary.name === name) {
    contactPrimary.email = email;
    updatedContact = contactPrimary;
  }

  const { contactSecondary } = caseEntity;
  if (contactSecondary && contactSecondary.name === name) {
    contactSecondary.email = email;
    updatedContact = contactSecondary;
  }

  if (!updatedContact) {
    throw new Error(
      `no contact primary or secondary found with that user name of ${name}`,
    );
  }

  const userEntity = new User(
    {
      contact: updatedContact,
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
    password: getRandomTemporaryPassword(),
    user: userEntity.validate().toRawObject(),
  });

  userEntity.userId = userId;

  const userCaseEntity = new UserCase(caseToAttachUser);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId,
  });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.validate().toRawObject();
};
