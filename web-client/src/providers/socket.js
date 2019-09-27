const socketRouter = () => {
  event => {
    const message = JSON.parse(event.data);
    const { action } = message;
    console.log(message);

    switch (action) {
      case 'zip_download_ready':
        break;
      default:
        break;
    }
  };
};

const createWebSocketClient = token => {
  const notificationsUrl = process.env.WS_URL || 'ws://localhost:3011';
  const connectionUrl = `${notificationsUrl}?token=${token}`;
  const socket = new WebSocket(connectionUrl);
  return socket;
};

export const socketProvider = () => {
  let app;
  let socket;

  const stop = () => {
    socket.close();
    socket = null;
  };

  const start = () => {
    const token = app.getState('token');

    if (socket && socket.close) {
      stop();
    }

    socket = createWebSocketClient(token);
    socket.onmessage = socketRouter(app);
    socket.onopen = event => console.log('socket:onopen', event);
    socket.onclose = event => console.log('socket:onclose', event);
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
