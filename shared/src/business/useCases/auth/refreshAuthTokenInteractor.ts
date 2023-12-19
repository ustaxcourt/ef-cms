export const refreshAuthTokenInteractor = async (
  applicationContext: IApplicationContext,
  { refreshToken }: { refreshToken: string },
): Promise<{
  token: string;
}> => {
  const { token } = await applicationContext
    .getPersistenceGateway()
    .renewIdToken(applicationContext, { refreshToken });

  return {
    token,
  };
};
