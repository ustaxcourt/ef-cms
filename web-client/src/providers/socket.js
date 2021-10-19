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
            console.error(error);
            return reject(error);
          };

          socket.onopen = () => {
            // the socket needs to be open for a short period or it could miss the first message
            setTimeout(() => {
              resolve();
            }, 300);
          };
          socket.onclose = e => {
            socket = null;
            if (!process.env.CI) {
              console.log(
                'Socket is closed. Reconnect will be attempted in 1 second.',
                e.reason,
              );
            }
            if (e && e.reason === 'Normal connection closure') {
              return;
            }
            setTimeout(() => {
              start();
            }, 1000);
          };
        } catch (e) {
          if (applicationContext) {
            console.error(e);
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
