export const appInstanceManagerHelper = (get, applicationContext) => {
  const broadcastChannel = applicationContext.getBroadcastGateway();

  return {
    channelHandle: broadcastChannel,
  };
};
