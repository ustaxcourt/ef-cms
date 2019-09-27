import { state } from 'cerebral';

export const setupNotificationListenerAction = async ({
  applicationContext,
  router,
  socket,
  store,
}) => {
  const token = applicationContext.getCurrentUserToken();
  const socketClient = applicationContext.getWebSocketClient(token);
  socket.start();
  socketClient.onopen = () => {};

  socketClient.onmessage = event => {
    // TODO: we should check for an event name
    const message = JSON.parse(event.data);
    const { url } = message;
    store.set(state.waitingForResponse, false);
    router.openInNewTab(url, false);
    socketClient.close();
  };
};
