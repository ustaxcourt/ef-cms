/**
 * calls externalRoute navigation method on the public site verify email instructions url
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.router the riot.router object that is used for changing the route
 */
export const navigateToPublicVerifyEmailInstructionsAction = ({
  applicationContext,
  router,
}) => {
  console.log('we are here');
  const publicSiteUrl = `${applicationContext.getPublicSiteUrl()}/verify-email-instructions`;
  router.externalRoute(publicSiteUrl);
};
