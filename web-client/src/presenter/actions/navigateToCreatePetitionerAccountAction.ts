export const navigateToCreatePetitionerAccountAction = async ({
  router,
}: ActionProps): Promise<void> => {
  await router.route('/create-account/petitioner');
};
