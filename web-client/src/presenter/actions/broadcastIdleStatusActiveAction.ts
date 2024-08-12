import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * broadcasts an idle status to all app instances
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} upon posting of message
 */
export const broadcastIdleStatusActiveAction = async ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  store.set(state.lastIdleAction, Date.now());
  const broadcastChannel = applicationContext.getBroadcastGateway();
  const message = props.closeModal
    ? BROADCAST_MESSAGES.stayLoggedIn
    : BROADCAST_MESSAGES.idleStatusActive;
  await broadcastChannel.postMessage({
    subject: message,
  });
};
