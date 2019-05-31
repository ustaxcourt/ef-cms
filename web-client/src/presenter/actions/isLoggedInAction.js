import { state } from 'cerebral';

/**
 * invokes the path in the sequeneces depending on if the user is logged in or not
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method for getting the state.user
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.router the riot.router object that is used for getting the current route
 * @returns {object} the list of section work items
 */
export const isLoggedInAction = ({ get, path, router }) => {
  const user = get(state.user);
  if (user) {
    return path['isLoggedIn']();
  } else {
    return path['unauthorized']({ path: router.route() });
  }
};
