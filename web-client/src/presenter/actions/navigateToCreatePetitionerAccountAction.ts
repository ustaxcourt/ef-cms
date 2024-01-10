export const navigateToCreatePetitionerAccountAction = async ({
  router,
}): Promise<void> => {
  await router.route('/create-account/petitioner');
};
