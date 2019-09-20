import { state } from 'cerebral';

export const setupNotificationListenerAction = async ({
  applicationContext,
  store,
}) => {
  const token = applicationContext.getCurrentUserToken();

  console.log(token);

  // TODO: should this come from app context?
  const socket = new WebSocket(`ws://localhost:3011?token=${token}`);
  socket.onopen = e => {
    console.log('e', e);
    console.log('we are open');
  };

  socket.onmessage = event => {
    console.log('event', event);
    const message = JSON.parse(event.data);
    const { url } = message;
    window.open(url, '_blank');
  };

  store.set(state.socket, socket);
};
