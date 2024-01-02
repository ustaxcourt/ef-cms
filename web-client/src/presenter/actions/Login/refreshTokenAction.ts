export const refreshTokenAction = async ({
  applicationContext,
}: ActionProps): Promise<{ idToken: string }> => {
  const { token } = await applicationContext
    .getUseCases()
    .renewIdTokenInteractor(applicationContext);

  return { idToken: token };
};
