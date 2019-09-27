import { state } from 'cerebral';

export const setupNotificationListenerAction = async ({
  applicationContext,
  router,
  store,
}) => {
  const token = applicationContext.getCurrentUserToken();
  const socket = applicationContext.getWebSocketClient(token);

  socket.onopen = () => {};

  socket.onmessage = event => {
    // TODO: we should check for an event name
    const message = JSON.parse(event.data);
    const { url } = message;
    store.set(state.waitingForResponse, false);
    router.openInNewTab(url, false);
    socket.close();
  };
};
