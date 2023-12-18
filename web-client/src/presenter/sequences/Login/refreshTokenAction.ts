export const refreshTokenAction = async ({
  applicationContext,
}: ActionProps): Promise<{ idToken: string }> => {
  const { token } = await applicationContext
    .getUseCases()
    .refreshTokenInteractor(applicationContext);
  return { idToken: token };
};
