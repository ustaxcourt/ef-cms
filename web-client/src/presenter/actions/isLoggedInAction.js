import { state } from 'cerebral';

/**
 * invokes the path in the sequeneces depending on if the user is logged in or not
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get method for getting the state.user
 * @param {Object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {Object} providers.router the riot.router object that is used for getting the current route
 * @returns {Object} the list of section work items
 */
export default ({ get, path, router }) => {
  const user = get(state.user);
  if (!user) {
    return path['unauthorized']({ path: router.route() });
  } else {
    return path['isLoggedIn']();
  }
};
