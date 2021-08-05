/**
 * startWebSocketConnectionAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path
 * @param {object} providers.socket the socket object
 * @returns {Promise<*>} the success or error path
 */
export const startWebSocketConnectionAction = async ({ path, socket }) => {
  try {
    await socket.start();
    return path.success();
  } catch {
    return path.error();
  }
};
