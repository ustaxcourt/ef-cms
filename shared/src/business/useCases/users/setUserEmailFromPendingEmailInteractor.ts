import { Practitioner } from '../../entities/Practitioner';
import { ROLES, SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { RawUser, User } from '../../entities/User';
import {
  updateCasesForPetitioner,
  updatePractitionerCases,
} from './verifyUserPendingEmailInteractor';

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
export const updatePetitionerCases = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
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

/**
 * setUserEmailFromPendingEmailInteractor
 *
 * this is invoked when logging in as a admissionsclerk and setting
 * a party's email to a new petitioner who doesn't exist in cognito yet.
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.user the user
 * @returns {Promise} the updated user object
 */
export const setUserEmailFromPendingEmailInteractor = async (
  applicationContext,
  { user },
) => {
  let userEntity;
  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    userEntity = new Practitioner({
      ...user,
      email: user.pendingEmail,
      pendingEmail: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  } else {
    userEntity = new User({
      ...user,
      email: user.pendingEmail,
      pendingEmail: undefined,
    });
  }

  const rawUser = userEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: rawUser,
  });

  try {
    if (userEntity.role === ROLES.petitioner) {
      await applicationContext
        .getMessageGateway()
        .sendUpdatePetitionerCasesMessage({
          applicationContext,
          user: rawUser,
        });
    } else {
      await updatePractitionerCases({
        applicationContext,
        user: rawUser,
      });
    }
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  }

  return rawUser;
};
