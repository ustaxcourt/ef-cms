exports.refreshAuthTokenInteractor = async (
  applicationContext,
  { refreshToken },
) => {
  const { token } = await applicationContext
    .getPersistenceGateway()
    .refreshToken(applicationContext, { refreshToken });
  return {
    token,
  };
};
