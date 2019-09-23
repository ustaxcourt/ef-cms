import { state } from 'cerebral';

export const destroyNotificationListenerAction = async ({ get }) => {
  const socket = get(state.socket);
  socket.close();
};
