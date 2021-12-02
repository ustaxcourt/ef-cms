/**
 * tells all open tabs to also logout
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext application context used to get the broadcast gateway
 * @returns {Promise} upon posting of message
 */
export const broadcastLogoutAction = async ({ applicationContext, props }) => {
  if (!props.skipBroadcast) {
    const broadcastChannel = applicationContext.getBroadcastGateway();
    await broadcastChannel.postMessage({ subject: 'logout' });
  }
};
