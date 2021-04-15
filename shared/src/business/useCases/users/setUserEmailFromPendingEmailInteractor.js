const {
  updateCasesForPetitioner,
} = require('./verifyUserPendingEmailInteractor');
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

  const petitionerCases = petitionerDocketNumbers.map(docketNumber => ({
    docketNumber,
  }));

  return await updateCasesForPetitioner({
    applicationContext,
    petitionerCases,
    user,
  });
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
