const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Practitioner } = require('../../entities/Practitioner');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const updatePetitionerCases = async ({ applicationContext, user }) => {
  let petitionerCases = await applicationContext
    .getPersistenceGateway()
    .getIndexedCasesForUser({
      applicationContext,
      statuses: applicationContext.getConstants().CASE_STATUSES,
      userId: user.userId,
    });

  for (let caseInfo of petitionerCases) {
    try {
      const { docketNumber } = caseInfo;

      const userCase = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      let caseRaw = new Case(userCase, { applicationContext })
        .validate()
        .toRawObject();

      const petitionerObject = [
        caseRaw.contactPrimary,
        caseRaw.contactSecondary,
      ].find(petitioner => petitioner && petitioner.contactId === user.userId);

      if (!petitionerObject) {
        throw new Error(
          `Could not find user|${user.userId} on ${docketNumber}`,
        );
      }

      // This updates the case by reference!
      petitionerObject.email = user.email;

      // we do this again so that it will convert '' to null
      const caseEntity = new Case(caseRaw, { applicationContext }).validate();

      await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      });
    } catch (error) {
      applicationContext.logger.error(error);
    }
  }
};

exports.updatePetitionerCases = updatePetitionerCases;

const updatePractitionerCases = async ({ applicationContext, user }) => {
  const docketNumbers = await applicationContext
    .getPersistenceGateway()
    .getCasesByUserId({
      applicationContext,
      userId: user.userId,
    });

  const updatedCases = [];

  for (let caseInfo of docketNumbers) {
    try {
      const { docketNumber } = caseInfo;

      const userCase = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      let caseEntity = new Case(userCase, { applicationContext });

      const practitionerObject = caseEntity.privatePractitioners
        .concat(caseEntity.irsPractitioners)
        .find(practitioner => practitioner.userId === user.userId);

      if (!practitionerObject) {
        throw new Error(
          `Could not find user|${user.userId} barNumber: ${user.barNumber} on ${docketNumber}`,
        );
      }

      // This updates the case by reference!
      practitionerObject.email = user.email;

      // we do this again so that it will convert '' to null
      caseEntity = new Case(caseEntity, { applicationContext });

      const updatedCase = await applicationContext
        .getUseCaseHelpers()
        .updateCaseAndAssociations({
          applicationContext,
          caseToUpdate: caseEntity,
        });

      updatedCases.push(updatedCase);

      await applicationContext.getNotificationGateway().sendNotificationToUser({
        applicationContext,
        message: {
          action: 'user_contact_update_progress',
          completedCases: updatedCases.length,
          totalCases: docketNumbers.length,
        },
        userId: user.userId,
      });
    } catch (error) {
      applicationContext.logger.error(error);
    }
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'user_contact_full_update_complete',
    },
    userId: user.userId,
  });

  return updatedCases;
};

/**
 * verifyUserPendingEmailInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.pendingEmail the pending email
 * @returns {Promise} the updated user object
 */
exports.verifyUserPendingEmailInteractor = async ({
  applicationContext,
  token,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  let userEntity;
  if (user.role === ROLES.petitioner) {
    userEntity = new User(user);
  } else {
    userEntity = new Practitioner(user);
  }

  if (
    !userEntity.pendingEmailVerificationToken ||
    userEntity.pendingEmailVerificationToken !== token
  ) {
    throw new UnauthorizedError('Tokens do not match');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: userEntity.pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  await applicationContext.getPersistenceGateway().updateUserEmail({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });

  userEntity.email = userEntity.pendingEmail;
  userEntity.pendingEmail = undefined;
  userEntity.pendingEmailVerificationToken = undefined;

  const updatedRawUser = userEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: updatedRawUser,
  });

  if (userEntity.role === ROLES.petitioner) {
    await updatePetitionerCases({
      applicationContext,
      user: updatedRawUser,
    });
  } else {
    await updatePractitionerCases({
      applicationContext,
      user: updatedRawUser,
    });
  }
};
