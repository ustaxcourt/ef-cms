exports.authenticateUserInteractor = async (applicationContext, { code }) => {
  const { idToken, refreshToken } = await applicationContext
    .getPersistenceGateway()
    .confirmAuthCode(applicationContext, { code });

  return {
    idToken,
    refreshToken,
  };
};
