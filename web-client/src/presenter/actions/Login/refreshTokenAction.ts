export const refreshTokenAction = async ({
  applicationContext,
}: ActionProps): Promise<{ idToken: string }> => {
  const { idToken } = await applicationContext
    .getUseCases()
    .renewIdTokenInteractor(applicationContext);

  return { idToken };
};
