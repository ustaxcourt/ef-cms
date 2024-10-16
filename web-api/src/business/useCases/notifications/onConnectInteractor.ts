import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const onConnectInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    connectionId,
    endpoint,
  }: { clientConnectionId: string; connectionId: string; endpoint: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!authorizedUser) {
    // silence local development errors
    return;
  }

  const endpointWProtocol =
    endpoint.slice(0, 8) === 'https://' ? endpoint : `https://${endpoint}`;

  await applicationContext.getPersistenceGateway().saveUserConnection({
    applicationContext,
    clientConnectionId,
    connectionId,
    endpoint: endpointWProtocol,
    userId: authorizedUser.userId,
  });
};
