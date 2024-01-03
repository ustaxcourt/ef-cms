export const refreshTokenAction = async ({
  applicationContext,
  path,
}: ActionProps): Promise<{ idToken: string }> => {
  try {
    const { idToken } = await applicationContext
      .getUseCases()
      .renewIdTokenInteractor(applicationContext);

    return path.userIsLoggedIn({ idToken });
  } catch (err) {
    return path.userIsNotLoggedIn();
  }
};
