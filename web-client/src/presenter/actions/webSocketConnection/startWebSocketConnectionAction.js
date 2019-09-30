/**
 * startWebSocketConnectionAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.socket the socket object
 */
export const startWebSocketConnectionAction = ({ socket }) => {
  socket.start();
};
