import { state } from 'cerebral';

/**
 * follows the given redirectUrl, calling the success path, or default path if no redirectUrl
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral method
 * @param {object} providers.path the next object in the path
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.store the cerebral store object
 */

export const followRedirectAction = async ({ get, path, router, store }) => {
  const redirectUrl = get(state.redirectUrl);

  if (redirectUrl) {
    store.set('redirectUrl', null);

    await router.route(redirectUrl);
    return path.success();
  } else {
    return path.default();
  }
};
