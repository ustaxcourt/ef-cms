export const navigateToAccountRegistrationAction = async ({
  router,
}: ActionProps): Promise<void> => {
  await router.route('/account-registration');
};
