import { BroadcastChannel } from 'broadcast-channel';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';

export const appInstanceManagerHelper = (
  _get: Get,
  applicationContext: ClientApplicationContext,
): { channelHandle: BroadcastChannel } => {
  const broadcastChannel = applicationContext.getBroadcastGateway();

  return {
    channelHandle: broadcastChannel,
  };
};
