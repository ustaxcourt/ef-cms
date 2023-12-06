export const onConnectInteractor = async (
  applicationContext: IApplicationContext,
  {
    clientConnectionId,
    connectionId,
    endpoint,
  }: { clientConnectionId: string; connectionId: string; endpoint: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (!authorizedUser) {
    // silence local development errors
    return;
  }

  await applicationContext.getPersistenceGateway().saveUserConnection({
    applicationContext,
    clientConnectionId,
    connectionId,
    endpoint,
    userId: authorizedUser.userId,
  });
};
