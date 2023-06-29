import { state } from '@web-client/presenter/app.cerebral';

/**
 * follows the given redirectUrl, calling the success path, or default path if no redirectUrl
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral method
 * @param {object} providers.path the next object in the path
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.store the cerebral store object
 * @returns {Function} the path to take
 */
export const followRedirectAction = async ({
  get,
  path,
  router,
  store,
}: ActionProps) => {
  const redirectUrl = get(state.redirectUrl);

  if (redirectUrl) {
    store.unset('redirectUrl');

    await router.route(redirectUrl);
    return path.success();
  } else {
    return path.default();
  }
};
