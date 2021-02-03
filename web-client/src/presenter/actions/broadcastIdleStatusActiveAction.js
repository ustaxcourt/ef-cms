/**
 * broadcasts an active state to all app instances
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @returns {number} total computed value from penalty values
 */
export const broadcastIdleStatusActiveAction = async ({
  applicationContext,
}) => {
  const { broadcastChannel } = applicationContext.getBroadcastGateway();

  await broadcastChannel.postMessage({ subject: 'idleStatusActive' });
};
