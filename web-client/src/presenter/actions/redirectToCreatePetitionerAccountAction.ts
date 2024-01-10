export const redirectToCreatePetitionerAccountAction = async ({
  applicationContext,
  router,
}): Promise<void> => {
  await router.externalRoute(
    `${applicationContext.getPrivateUrl()}/create-account/petitioner`,
  );
};
