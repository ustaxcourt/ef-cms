import { ServerApplicationContext } from '@web-api/applicationContext';

export const onConnectInteractor = async (
  applicationContext: ServerApplicationContext,
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
