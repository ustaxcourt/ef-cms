/**
 * tells all open tabs to also logout
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext application context used to get the broadcast gateway
 * @returns {Promise} upon posting of message
 */
export const broadcastLogoutAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  // for some reason this causes jest integration tests to never finish, so don't run in CI
  if (!process.env.CI && !props.skipBroadcast) {
    const broadcastChannel = applicationContext.getBroadcastGateway();
    await broadcastChannel.postMessage({ subject: 'logout' });
  }
};
