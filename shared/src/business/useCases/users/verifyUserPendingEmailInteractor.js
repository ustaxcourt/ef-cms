const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { Practitioner } = require('../../entities/Practitioner');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const updateCasesForPetitioner = async ({
  applicationContext,
  petitionerCases,
  user,
}) => {
  const casesToUpdate = await Promise.all(
    petitionerCases.map(({ docketNumber }) =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  const validatedCasesToUpdate = casesToUpdate
    .map(caseToUpdate => {
      const caseEntity = new Case(caseToUpdate, {
        applicationContext,
      });

      const petitionerObject = caseEntity.getPetitionerById(user.userId);
      if (!petitionerObject) {
        applicationContext.logger.error(
          `Could not find user|${user.userId} on ${caseEntity.docketNumber}`,
        );
        return;
      }

      petitionerObject.email = user.email;

      if (
        !caseEntity.isUserIdRepresentedByPrivatePractitioner(
          petitionerObject.contactId,
        )
      ) {
        petitionerObject.serviceIndicator =
          SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      }

      const newCase = new Case(caseEntity, { applicationContext }).validate();
      return newCase;
    })
    // if petitioner is not found on the case, function exits early and returns `undefined`.
    // if this happens, continue with remaining cases and do not throw exception, but discard
    // any undefined values by filtering for truthy objects.
    .filter(Boolean);

  return Promise.all(
    validatedCasesToUpdate.map(caseToUpdate =>
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate,
      }),
    ),
  );
};

exports.updateCasesForPetitioner = updateCasesForPetitioner;

/**
 * updatePetitionerCases
 * for the provided user, update their email address on all cases
 * where they are the contactPrimary or contactSecondary
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the user who is a primary or secondary contact on a case
 * @returns {Promise} resolves upon completion of case updates
 */
const updatePetitionerCases = async ({ applicationContext, user }) => {
  const petitionerCases = await applicationContext
    .getPersistenceGateway()
    .getIndexedCasesForUser({
      applicationContext,
      statuses: applicationContext.getConstants().CASE_STATUSES,
      userId: user.userId,
    });

  return await updateCasesForPetitioner({
    applicationContext,
    petitionerCases,
    user,
  });
};

exports.updatePetitionerCases = updatePetitionerCases;

/**
 * updatePractitionerCases
 * for the provided user, update their email address on all cases
 * where they are an IRS practitioner or private practitioner, sending an
 * update to the practitioner for each case updated, as well as a final email when
 * all case updates have been completed.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the user who is a primary or secondary contact on a case
 * @returns {Promise} resolves upon completion of case updates
 */
const updatePractitionerCases = async ({ applicationContext, user }) => {
  const practitionerDocketNumbers = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  const casesToUpdate = await Promise.all(
    practitionerDocketNumbers.map(docketNumber =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  const validCasesToUpdate = casesToUpdate
    .map(caseToUpdate => {
      const caseEntity = new Case(caseToUpdate, { applicationContext });
      const practitionerObject = [
        ...caseEntity.privatePractitioners,
        ...caseEntity.irsPractitioners,
      ].find(practitioner => practitioner.userId === user.userId);

      if (!practitionerObject) {
        applicationContext.logger.error(
          `Could not find user|${user.userId} barNumber: ${user.barNumber} on ${caseToUpdate.docketNumber}`,
        );
        return;
      }
      // This updates the case by reference!
      practitionerObject.email = user.email;
      practitionerObject.serviceIndicator =
        SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;

      // we do this again so that it will convert '' to null
      return new Case(caseEntity, { applicationContext }).validate();
    })
    // if practitioner is not found on the case, function exits early and returns `undefined`.
    // if this happens, continue with remaining cases and do not throw exception, but discard
    // any undefined values by filtering for truthy objects.
    .filter(Boolean);

  for (let idx = 0; idx < validCasesToUpdate.length; idx++) {
    const validatedCaseToUpdate = validCasesToUpdate[idx];
    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: validatedCaseToUpdate,
    });

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_update_progress',
        completedCases: idx + 1,
        totalCases: validCasesToUpdate.length,
      },
      userId: user.userId,
    });
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'user_contact_full_update_complete',
    },
    userId: user.userId,
  });

  return validCasesToUpdate;
};
exports.updatePractitionerCases = updatePractitionerCases;

/**
 * verifyUserPendingEmailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.pendingEmail the pending email
 * @returns {Promise} the updated user object
 */
exports.verifyUserPendingEmailInteractor = async (
  applicationContext,
  { token },
) => {
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

  try {
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
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  }
};
