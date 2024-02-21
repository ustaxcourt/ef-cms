import { delay } from '@web-client/utilities/delay';

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
  let socket: WebSocket;
  let pingInterval;
  let reconnectAttempt = 0;
  // API Gateway is 10 minute idle timeout, so let's just do 1 minute ping interval
  const PING_INTERVAL = 1000 * 60;

  const stopSocket = () => {
    if (socket) {
      clearInterval(pingInterval);
      socket.close(1000, 'Normal connection closure');
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

          socket.onclose = async closeEvent => {
            stopSocket();
            if (closeEvent && closeEvent.code !== 1000) {
              reconnectAttempt++;
              const timeToWaitBeforeReconnect = 1000 * 2 ** reconnectAttempt;

              if (reconnectAttempt > 4) {
                reject();
                return;
              }
              // eslint-disable-next-line promise/param-names
              await delay(timeToWaitBeforeReconnect);

              await start();

              reconnectAttempt = 0;
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
