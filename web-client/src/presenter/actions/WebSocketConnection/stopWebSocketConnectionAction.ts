export const stopWebSocketConnectionAction = ({
  socket,
}: ActionProps & { socket: { stop: () => void } }) => {
  socket.stop();
};
