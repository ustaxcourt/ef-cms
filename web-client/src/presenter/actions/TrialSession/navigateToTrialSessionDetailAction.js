import { state } from 'cerebral';

/**
 * changes the route to view the trial sessions
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise<*>} the promise when the item is complete
 */
export const navigateToTrialSessionDetailAction = async ({ get, router }) => {
  const trialSessionId = get(state.trialSessionId);
  await router.route(`/trial-session-detail/${trialSessionId}`);
};
