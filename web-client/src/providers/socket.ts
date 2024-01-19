const createWebSocketClient = ({ clientConnectionId, token }) => {
  const notificationsUrl = process.env.WS_URL || 'ws://localhost:3011';
  const connectionUrl = `${notificationsUrl}?token=${token}&clientConnectionId=${clientConnectionId}`;
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
  let pingInterval;
  // API Gateway is 10 minute idle timeout, so let's just do 1 minute ping interval
  const PING_INTERVAL = 1000 * 60;

  const stopSocket = () => {
    if (socket) {
      clearInterval(pingInterval);
      socket.close();
      socket = null;
    }
  };

  const start = () => {
    const token = app.getState('token');
    const clientConnectionId = app.getState('clientConnectionId');
    if (!socket) {
      return new Promise<void>((resolve, reject) => {
        try {
          socket = createWebSocketClient({ clientConnectionId, token });

          socket.onmessage = socketRouter(app);

          socket.onerror = error => {
            console.error(error);
            return reject(error);
          };

          socket.onclose = async err => {
            stopSocket();
            if (err && err.reason !== 'Normal connection closure') {
              console.error(err);
              await start();
            }
          };

          socket.onopen = () => {
            // the socket needs to be open for a short period or it could miss the first message
            setTimeout(() => {
              resolve();
            }, 300);

            pingInterval = setInterval(() => {
              socket.send('ping');
            }, PING_INTERVAL);
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
