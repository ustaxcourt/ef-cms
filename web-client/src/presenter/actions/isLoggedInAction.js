/**
 * invokes the path in the sequences depending on if the user is logged in or not
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.router the riot.router object that is used for getting the current route
 * @returns {object} the list of section work items
 */
export const isLoggedInAction = ({ applicationContext, path, router }) => {
  const user = applicationContext.getCurrentUser();
  if (user) {
    return path['isLoggedIn']();
  } else {
    return path['unauthorized']({ path: router.route() });
  }
};
