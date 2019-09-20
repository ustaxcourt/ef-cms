import { state } from 'cerebral';

export const setupNotificationListenerAction = async ({
  applicationContext,
  store,
}) => {
  const token = applicationContext.getCurrentUserToken();

  // TODO: should this come from app context?
  const socket = new WebSocket(`ws://localhost:3011?token=${token}`);
  socket.onopen = () => {};

  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    const { url } = message;
    window.open(url, '_blank');
  };

  store.set(state.socket, socket);
};
