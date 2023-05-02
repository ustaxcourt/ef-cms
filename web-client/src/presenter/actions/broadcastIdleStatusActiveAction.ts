/**
 * broadcasts an idle status to all app instances
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} upon posting of message
 */
export const broadcastIdleStatusActiveAction = async ({
  applicationContext,
}: ActionProps) => {
  const broadcastChannel = applicationContext.getBroadcastGateway();

  await broadcastChannel.postMessage({ subject: 'idleStatusActive' });
};
