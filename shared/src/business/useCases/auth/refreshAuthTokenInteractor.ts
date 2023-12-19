export const refreshAuthTokenInteractor = async (
  applicationContext: IApplicationContext,
  { refreshToken }: { refreshToken: string },
): Promise<{
  token: string;
}> => {
  if (!refreshToken) {
    throw new Error('refreshToken is required');
  }
  const { token } = await applicationContext
    .getPersistenceGateway()
    .renewIdToken(applicationContext, { refreshToken });

  return {
    token,
  };
};
