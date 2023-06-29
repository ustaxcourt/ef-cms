/**
 * calls externalRoute navigation method on the public site url
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */

export const navigateToPublicSiteAction = ({
  applicationContext,
  router,
}: ActionProps) => {
  const publicSiteUrl = applicationContext.getPublicSiteUrl();
  router.externalRoute(publicSiteUrl);
};
