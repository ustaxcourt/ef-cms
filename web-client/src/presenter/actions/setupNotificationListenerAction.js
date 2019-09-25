import { state } from 'cerebral';

export const setupNotificationListenerAction = async ({
  applicationContext,
  store,
}) => {
  const token = applicationContext.getCurrentUserToken();

  const socket = new WebSocket(
    `${applicationContext.getNotificationsUrl()}?token=${token}`,
  );
  socket.onopen = () => {};

  socket.onmessage = event => {
    // TODO: we should check for an event name
    const message = JSON.parse(event.data);
    const { url } = message;
    store.set(state.waitingForResponse, false);
    window.open(url, '_blank');
    socket.close();
  };
};
