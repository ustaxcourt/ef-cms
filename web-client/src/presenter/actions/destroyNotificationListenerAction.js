import { state } from 'cerebral';

export const destroyNotificationListenerAction = async ({ get }) => {
  const socket = get(state.socket);
  console.log('closing socket');
  socket.close();
};
