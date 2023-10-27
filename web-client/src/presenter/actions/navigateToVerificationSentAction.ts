export const navigateToVerificationSentAction = async ({
  router,
}: ActionProps) => {
  //  TODO: ask UX to confirm, but probably navigate to login if email not defined in state
  await router.route('/create-account/verification-sent');
};
