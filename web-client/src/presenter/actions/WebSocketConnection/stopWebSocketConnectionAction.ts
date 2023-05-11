/**
 * stopWebSocketConnectionAction
 * @param {object} providers the providers object
 * @param {object} providers.socket the socket object
 */
export const stopWebSocketConnectionAction = ({ socket }: ActionProps) => {
  socket.stop();
};
