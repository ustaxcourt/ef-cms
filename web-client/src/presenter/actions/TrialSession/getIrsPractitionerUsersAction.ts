export const getIrsPractitionerUsersAction = async ({
  applicationContext,
}: ActionProps) => {
  const irsPractitioners = await applicationContext
    .getUseCases()
    .getAllUsersByRoleInteractor(applicationContext, ['irsPractitioner']);

  return { irsPractitioners };
};
