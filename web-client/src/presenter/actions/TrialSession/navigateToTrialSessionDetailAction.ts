import { state } from '@web-client/presenter/app.cerebral';

/**
 * changes the route to view the trial sessions
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the passed in props
 * @returns {Promise<*>} the promise when the item is complete
 */
export const navigateToTrialSessionDetailAction = async ({
  get,
  router,
}: ActionProps) => {
  const trialSessionId = get(state.trialSession.trialSessionId);
  await router.route(`/trial-session-detail/${trialSessionId}`);
};
