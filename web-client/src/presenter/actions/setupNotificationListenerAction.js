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
    const message = JSON.parse(event.data);
    const { url } = message;
    window.open(url, '_blank');
    socket.close();
  };

  store.set(state.socket, socket);
};
