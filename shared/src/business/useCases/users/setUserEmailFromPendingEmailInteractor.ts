import { Practitioner } from '../../entities/Practitioner';
import { ROLES, SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { User } from '../../entities/User';
import { acquireLock } from '@shared/business/useCaseHelper/acquireLock';
import { updatePractitionerCases } from './verifyUserPendingEmailInteractor';
/**
 * setUserEmailFromPendingEmailInteractor
 *
 * this is invoked when logging in as a admissionsclerk and setting
 * a party's email to a new petitioner who doesn't exist in cognito yet.
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
  let docketNumbersAssociatedWithUser;
  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    docketNumbersAssociatedWithUser = await applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser({
        applicationContext,
        userId: user.userId,
      });
    userEntity = new Practitioner({
      ...user,
      email: user.pendingEmail,
      pendingEmail: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
    await acquireLock({
      applicationContext,
      identifiers: docketNumbersAssociatedWithUser.map(item => `case|${item}`),
      retries: 5,
      waitTime: 3000,
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
        docketNumbersAssociatedWithUser,
        user: rawUser,
      });
      await Promise.all(
        docketNumbersAssociatedWithUser.map(docketNumber =>
          applicationContext.getPersistenceGateway().removeLock({
            applicationContext,
            identifiers: [`case|${docketNumber}`],
          }),
        ),
      );
    }
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  }

  return rawUser;
};
