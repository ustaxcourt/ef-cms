import { state } from 'cerebral';

/**
 * stopWebSocketConnectionAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.socket the socket object
 */
export const stopWebSocketConnectionAction = ({ get, socket, store }) => {
  let pingInterval = get(state.wsPingInterval);
  clearInterval(pingInterval);
  store.set(state.wsPingInterval, undefined);
  socket.stop();
};
