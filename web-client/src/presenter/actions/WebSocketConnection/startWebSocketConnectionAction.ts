import { state } from '@web-client/presenter/app.cerebral';

/**
 * startWebSocketConnectionAction
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path
 * @param {object} providers.socket the socket object
 * @returns {Promise<*>} the success or error path
 */
export const startWebSocketConnectionAction = async ({
  get,
  path,
  socket,
}: ActionProps & { socket: { start: () => Promise<void> } }) => {
  const isReadOnlyMode = get(state.readOnlyMode);

  if (isReadOnlyMode) {
    return path.startPolling();
  }

  try {
    await socket.start();
    // 7095 - We don't do anything with the error anymore because it will make
    // the application unusable for people who have disabled websocket requests
    // on their browser.
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return path.success();
};
