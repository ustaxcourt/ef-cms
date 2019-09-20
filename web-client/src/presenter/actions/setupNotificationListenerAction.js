import { state } from 'cerebral';

export const setupNotificationListenerAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const token = applicationContext.getCurrentUserToken();

  console.log(token);

  const socket = new WebSocket(`ws://localhost:3011?token=${token}`);
  socket.onopen = e => {
    console.log('e', e);
    console.log('we are open');
  };

  socket.onmessage = event => {
    console.log('event', event);
  };
};
