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
  let applicationContext;
  let socket;

  const stopSocket = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };

  const start = () => {
    const token = app.getState('token');
    if (!socket) {
      return new Promise((resolve, reject) => {
        try {
          socket = createWebSocketClient(token);
          socket.onmessage = socketRouter(app);
          socket.onerror = error => {
            applicationContext.logger.error('Websocket error detected', error);
            return reject(error);
          };

          socket.onopen = () => {
            // the socket needs to be open for a short period or it could miss the first message
            setTimeout(() => {
              resolve();
            }, 300);
          };
        } catch (e) {
          if (applicationContext) {
            applicationContext.logger.error(
              'Failed to establish WebSocket connection',
              { e },
            );
          }
          reject();
        }
      });
    }
  };

  const initialize = (_app, _applicationContext) => {
    app = _app;
    applicationContext = _applicationContext;
  };

  return {
    initialize,
    start,
    stop: stopSocket,
  };
};
