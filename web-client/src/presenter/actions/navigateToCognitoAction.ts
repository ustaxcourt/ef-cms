import { state } from '@web-client/presenter/app.cerebral';

/**
 * changes the route to view the cognito url from state
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.get the cerebral get method
 * @returns {Promise} async action
 */
export const navigateToCognitoAction = async ({ get, router }: ActionProps) => {
  const path = get(state.cognitoLoginUrl);
  await router.externalRoute(path);
};
