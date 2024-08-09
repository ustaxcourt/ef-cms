import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setDawsonHasUpdatedAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  store.set(state.dawsonHasUpdated, true);

  // Clear the refresh token interval since all subsequent requests until refresh will fail
  const oldInterval = get(state.refreshTokenInterval);
  clearInterval(oldInterval);
  store.unset(state.refreshTokenInterval);

  // Ensure consistency across tabs
  if (!props.skipBroadcast) {
    const broadcastChannel = applicationContext.getBroadcastGateway();
    await broadcastChannel.postMessage({
      subject: BROADCAST_MESSAGES.dawsonHasUpdated,
    });
  }
};
