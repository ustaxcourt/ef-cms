/**
 * Stop websocket connection
 */
export const stopWebSocketConnectionAction = ({ socket }) => {
  socket.stop();
};
