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
    .refreshToken(applicationContext, { rToken: refreshToken });
  return {
    token,
  };
};
