import { state } from '@web-client/presenter/app.cerebral';

/**
 * invokes the path in the sequences depending on if the user is logged in or not
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.router the riot.router object that is used for getting the current route
 * @returns {object} the list of section work items
 */
export const isLoggedInAction = async ({ get, path, router }: ActionProps) => {
  if (get(state.token)) {
    return path['isLoggedIn']();
  } else {
    return path['unauthorized']({ path: await router.route() });
  }
};
