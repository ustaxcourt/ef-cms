import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const appInstanceManagerHelper = (
  _get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const broadcastChannel = applicationContext.getBroadcastGateway();

  return {
    channelHandle: broadcastChannel,
  };
};
