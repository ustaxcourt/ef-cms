import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';

export const broadcastAppUpdatedAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  if (!props.skipBroadcast) {
    const broadcastChannel = applicationContext.getBroadcastGateway();
    await broadcastChannel.postMessage({
      subject: BROADCAST_MESSAGES.appHasUpdated,
    });
  }
};
