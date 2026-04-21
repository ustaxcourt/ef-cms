import { state } from '@web-client/presenter/app.cerebral';

/**
 * starts the read-only mode polling action
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.socket the socket object
 * @param {object} providers.store the cerebral store object
 */
export const startReadOnlyModePollingAction = ({
  applicationContext,
  get,
  socket,
  store,
}: ActionProps & { socket: { start: () => Promise<void> } }) => {
  const { READ_ONLY_POLLING_INTERVAL } = applicationContext.getConstants();
  const oldInterval = get(state.readOnlyPollingInterval);

  if (oldInterval) {
    clearInterval(oldInterval);
    store.unset(state.readOnlyPollingInterval);
  }

  const interval = setInterval(async () => {
    const { readOnlyMode } = await applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor(applicationContext);

    if (!readOnlyMode) {
      const currentInterval = get(state.readOnlyPollingInterval);
      if (currentInterval) {
        clearInterval(currentInterval);
        store.unset(state.readOnlyPollingInterval);
      }

      store.set(state.readOnlyMode, false);

      try {
        await socket.start();
      } catch (e) {
        // we don't handle the error since it makes the application unusable for people who disabled websocket requests
      }
    }
  }, READ_ONLY_POLLING_INTERVAL);

  store.set(state.readOnlyPollingInterval, interval);
};
