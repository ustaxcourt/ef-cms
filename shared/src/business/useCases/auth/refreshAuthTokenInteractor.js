exports.refreshAuthTokenInteractor = async (
  applicationContext,
  { refreshToken },
) => {
  const { idToken } = await applicationContext
    .getPersistenceGateway()
    .refreshToken(applicationContext, { refreshToken });
  return {
    idToken,
  };
};
