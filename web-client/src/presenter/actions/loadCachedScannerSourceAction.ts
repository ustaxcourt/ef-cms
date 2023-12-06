import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the scanner source name from local storage
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for accessing local storage
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @returns {string} the scanner source name from local storage
 */
export const loadCachedScannerSourceAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  const scannerSourceName = await applicationContext
    .getPersistenceGateway()
    .getItem({
      applicationContext,
      key: 'scannerSourceName',
    });

  const scannerSourceIndex = await applicationContext
    .getPersistenceGateway()
    .getItem({
      applicationContext,
      key: 'scannerSourceIndex',
    });

  store.set(state.scanner.scannerSourceName, scannerSourceName);
  store.set(state.scanner.scannerSourceIndex, scannerSourceIndex);
};
