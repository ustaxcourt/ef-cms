import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from '../../utilities/cerebralWrapper';
export const appInstanceManagerHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const broadcastChannel = applicationContext.getBroadcastGateway();

  return {
    channelHandle: broadcastChannel,
  };
};
