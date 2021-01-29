/**
 * calls externalRoute navigation method on the public site verify email instructions url
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToPublicVerifyEmailInstructionsAction = ({
  applicationContext,
  router,
}) => {
  const publicSiteUrl = `${applicationContext.getPublicSiteUrl()}/verify-email-instructions`;
  router.externalRoute(publicSiteUrl);
};
