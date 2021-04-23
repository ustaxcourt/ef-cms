const { Case } = require('../../entities/cases/Case');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

/**
 * updatePetitionerCases
 * for the provided user, update their email address on all cases
 * where they are the contactPrimary
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the user who is a primary contact on a case
 * @returns {Promise} resolves upon completion of case updates
 */
const updatePetitionerCases = async ({ applicationContext, user }) => {
  const petitionerDocketNumbers = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  const casesToUpdate = await Promise.all(
    petitionerDocketNumbers.map(docketNumber =>
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

      const contactPrimary = caseEntity.getContactPrimary();

      if (contactPrimary.contactId !== user.userId) {
        applicationContext.logger.error(
          `Could not find user|${user.userId} on ${caseEntity.docketNumber}`,
        );
        return;
      }
      // This updates the case by reference!
      contactPrimary.email = user.email;
      contactPrimary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;

      // we do this again so that it will convert '' to null
      return new Case(caseEntity, { applicationContext }).validate();
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

exports.updatePetitionerCases = updatePetitionerCases;

/**
 * setUserEmailFromPendingEmailInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the user
 * @returns {Promise} the updated user object
 */
exports.setUserEmailFromPendingEmailInteractor = async ({
  applicationContext,
  user,
}) => {
  const userEntity = new User({
    ...user,
    email: user.pendingEmail,
    pendingEmail: undefined,
  });

  const rawUser = userEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: rawUser,
  });

  await updatePetitionerCases({
    applicationContext,
    user: rawUser,
  });

  return rawUser;
};
