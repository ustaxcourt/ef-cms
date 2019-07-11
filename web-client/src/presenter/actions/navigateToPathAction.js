import { state } from 'cerebral';

/**
 * changes the route to path provided in state.path
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {Function} providers.get the cerebral get function used for getting the path to navigate to in state.path
 * @returns {Promise} async action
 */
export const navigateToPathAction = async ({ get, props, router }) => {
  const path = props.path || get(state.path);
  await router.route(path);
};
