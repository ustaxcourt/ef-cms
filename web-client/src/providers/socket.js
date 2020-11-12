const createWebSocketClient = token => {
  const notificationsUrl = process.env.WS_URL || 'ws://localhost:3011';
  const connectionUrl = `${notificationsUrl}?token=${token}`;
  const socket = new WebSocket(
    connectionUrl,
    connectionUrl.indexOf('localhost') !== -1 ? 'echo-protocol' : undefined,
  );
  return socket;
};

export const socketProvider = ({ socketRouter }) => {
  let app;
  let socket;

  const stop = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };

  const start = () => {
    const token = app.getState('token');

    if (socket && socket.close) {
      stop();
    }

    return new Promise((resolve, reject) => {
      socket = createWebSocketClient(token);
      socket.onmessage = socketRouter(app);
      socket.onerror = reject;

      socket.onopen = () => {
        // the socket needs to be open for a few seconds or it could miss the first message
        setTimeout(() => {
          resolve();
        }, 2000);
      };
    });
  };

  const initialize = _app => {
    app = _app;
  };

  return {
    initialize,
    start,
    stop,
  };
};
