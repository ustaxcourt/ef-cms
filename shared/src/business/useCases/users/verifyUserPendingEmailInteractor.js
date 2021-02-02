const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Practitioner } = require('../../entities/Practitioner');
const { UnauthorizedError } = require('../../../errors/errors');

const updateUserCases = async ({ applicationContext, user }) => {
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
      await applicationContext.notifyHoneybadger(error);
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

  const practitionerEntity = new Practitioner(user);

  if (
    !practitionerEntity.pendingEmailVerificationToken ||
    practitionerEntity.pendingEmailVerificationToken !== token
  ) {
    throw new UnauthorizedError('Tokens do not match');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: practitionerEntity.pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  await applicationContext.getPersistenceGateway().updateUserEmail({
    applicationContext,
    user: practitionerEntity.validate().toRawObject(),
  });

  practitionerEntity.email = practitionerEntity.pendingEmail;
  practitionerEntity.pendingEmail = undefined;
  practitionerEntity.pendingEmailVerificationToken = undefined;

  const updatedRawPractitioner = practitionerEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: updatedRawPractitioner,
  });

  await updateUserCases({ applicationContext, user: updatedRawPractitioner });
};
