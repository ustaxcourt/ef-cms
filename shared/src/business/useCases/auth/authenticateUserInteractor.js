exports.authenticateUserInteractor = async (applicationContext, { code }) => {
  const { refreshToken, token } = await applicationContext
    .getPersistenceGateway()
    .confirmAuthCode(applicationContext, { code });

  return {
    refreshToken,
    token,
  };
};
