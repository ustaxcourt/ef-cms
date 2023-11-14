export const navigateToVerificationSentAction = async ({
  router,
}: ActionProps) => {
  await router.route('/create-account/verification-sent');
};
