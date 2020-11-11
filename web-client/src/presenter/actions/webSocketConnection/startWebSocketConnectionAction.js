import { state } from 'cerebral';

/**
 * startWebSocketConnectionAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path
 * @param {object} providers.socket the socket object
 * @returns {Promise<*>} the success or error path
 */
export const startWebSocketConnectionAction = async ({
  get,
  path,
  socket,
  store,
}) => {
  let pingInterval = get(state.wsPingInterval);
  clearInterval(pingInterval);

  try {
    const websocket = await socket.start();

    pingInterval = setInterval(async () => {
      await websocket.send('ping');
    }, 30000); // todo: constant

    store.set(state.wsPingInterval, pingInterval);

    return path.success();
  } catch (e) {
    clearInterval(pingInterval);
    console.log(e);
    return path.error();
  }
};
