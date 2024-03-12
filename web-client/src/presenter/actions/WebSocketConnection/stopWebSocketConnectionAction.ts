export const stopWebSocketConnectionAction = ({ socket }: ActionProps) => {
  socket.stop();
};
