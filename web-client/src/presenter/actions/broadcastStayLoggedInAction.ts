import { LOGOUT_BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';

/**
 * broadcasts a stay logged in message to all app instances
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext application context used to get the broadcast gateway
 * @returns {Promise} upon posting of message
 */
export const broadcastStayLoggedInAction = async ({
  applicationContext,
}: ActionProps) => {
  const broadcastChannel = applicationContext.getBroadcastGateway();

  await broadcastChannel.postMessage({
    subject: LOGOUT_BROADCAST_MESSAGES.stayLoggedIn,
  });
};
