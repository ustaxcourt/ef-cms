import { state } from 'cerebral';

/**
 * Fetches notifications for a user
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.user.token
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {function} providers.get the cerebral get method
 * @returns {object} contains the caseDetail returned from the use case
 */
export const getNotificationsAction = async ({ applicationContext, get }) => {
  const judgeUserId = get(state.judgeUser.userId);

  const notifications = await applicationContext
    .getUseCases()
    .getNotificationsInteractor(applicationContext, {
      judgeUserId,
    });

  return { notifications };
};
