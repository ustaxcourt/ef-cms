/**
 * calls externalRoute navigation method on the public site verify email instructions url
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.router the riot.router object that is used for changing the route
 */
export const navigateToPublicEmailVerificationInstructionsAction = ({
  applicationContext,
  router,
}: ActionProps) => {
  const publicSiteUrl = `${applicationContext.getPublicSiteUrl()}/email-verification-instructions`;
  router.externalRoute(publicSiteUrl);
};
